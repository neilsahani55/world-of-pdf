/* ===========================================================
   World of PDF — Binary Format Utilities
   Pure helpers: ZIP read/write, BMP/TIFF encoding, DOCX
   creation, DOCX/PPTX text extraction, CSV building.
   No DOM dependencies — also runnable under Node for tests.
   =========================================================== */

(function (global) {
    'use strict';

    /* ── CRC-32 (for ZIP) ── */
    const CRC_TABLE = (() => {
        const t = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            t[n] = c >>> 0;
        }
        return t;
    })();

    function crc32(bytes) {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
        return (c ^ 0xFFFFFFFF) >>> 0;
    }

    const te = new TextEncoder();
    const td = new TextDecoder();

    /* ── ZIP writer (stored / no compression) ──
       entries: [{ name: 'file.txt', data: Uint8Array }] → Uint8Array */
    function zipStore(entries) {
        // Fixed DOS date: 2026-01-01 00:00 (deterministic output)
        const dosDate = ((2026 - 1980) << 9) | (1 << 5) | 1;
        const locals = [];
        const centrals = [];
        let offset = 0;

        for (const e of entries) {
            const name = te.encode(e.name);
            const data = e.data;
            const crc = crc32(data);

            const local = new Uint8Array(30 + name.length + data.length);
            const lv = new DataView(local.buffer);
            lv.setUint32(0, 0x04034b50, true);
            lv.setUint16(4, 20, true);            // version needed
            lv.setUint16(6, 0x0800, true);        // UTF-8 names
            lv.setUint16(8, 0, true);             // method: stored
            lv.setUint16(10, 0, true);            // time
            lv.setUint16(12, dosDate, true);      // date
            lv.setUint32(14, crc, true);
            lv.setUint32(18, data.length, true);  // compressed size
            lv.setUint32(22, data.length, true);  // uncompressed size
            lv.setUint16(26, name.length, true);
            lv.setUint16(28, 0, true);            // extra length
            local.set(name, 30);
            local.set(data, 30 + name.length);
            locals.push(local);

            const cen = new Uint8Array(46 + name.length);
            const cv = new DataView(cen.buffer);
            cv.setUint32(0, 0x02014b50, true);
            cv.setUint16(4, 20, true);            // made by
            cv.setUint16(6, 20, true);            // needed
            cv.setUint16(8, 0x0800, true);
            cv.setUint16(10, 0, true);            // method
            cv.setUint16(12, 0, true);
            cv.setUint16(14, dosDate, true);
            cv.setUint32(16, crc, true);
            cv.setUint32(20, data.length, true);
            cv.setUint32(24, data.length, true);
            cv.setUint16(28, name.length, true);
            cv.setUint32(42, offset, true);       // local header offset
            cen.set(name, 46);
            centrals.push(cen);

            offset += local.length;
        }

        const cdSize = centrals.reduce((s, c) => s + c.length, 0);
        const end = new Uint8Array(22);
        const ev = new DataView(end.buffer);
        ev.setUint32(0, 0x06054b50, true);
        ev.setUint16(8, entries.length, true);
        ev.setUint16(10, entries.length, true);
        ev.setUint32(12, cdSize, true);
        ev.setUint32(16, offset, true);           // central dir offset

        const total = offset + cdSize + 22;
        const out = new Uint8Array(total);
        let p = 0;
        for (const l of locals) { out.set(l, p); p += l.length; }
        for (const c of centrals) { out.set(c, p); p += c.length; }
        out.set(end, p);
        return out;
    }

    /* ── ZIP reader ──
       Returns [{ name, method, data }] with data still compressed for method 8. */
    function zipParse(bytes) {
        // Find End Of Central Directory record (scan backwards)
        let eocd = -1;
        for (let i = bytes.length - 22; i >= 0; i--) {
            if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) { eocd = i; break; }
        }
        if (eocd < 0) throw new Error('Not a valid ZIP archive');
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const count = view.getUint16(eocd + 10, true);
        let p = view.getUint32(eocd + 16, true);
        const entries = [];
        for (let i = 0; i < count; i++) {
            if (view.getUint32(p, true) !== 0x02014b50) throw new Error('Bad central directory');
            const method = view.getUint16(p + 10, true);
            const compSize = view.getUint32(p + 20, true);
            const nameLen = view.getUint16(p + 28, true);
            const extraLen = view.getUint16(p + 30, true);
            const cmtLen = view.getUint16(p + 32, true);
            const localOff = view.getUint32(p + 42, true);
            const name = td.decode(bytes.subarray(p + 46, p + 46 + nameLen));
            // Local header: 30 bytes + its own name/extra lengths
            const lNameLen = view.getUint16(localOff + 26, true);
            const lExtraLen = view.getUint16(localOff + 28, true);
            const dataStart = localOff + 30 + lNameLen + lExtraLen;
            entries.push({ name: name.replace(/\\/g, '/'), method, data: bytes.subarray(dataStart, dataStart + compSize) });
            p += 46 + nameLen + extraLen + cmtLen;
        }
        return entries;
    }

    /* ── Inflate raw deflate data (ZIP method 8) via DecompressionStream ── */
    async function inflateRaw(data) {
        if (typeof DecompressionStream === 'undefined') throw new Error('Your browser does not support decompression (needs Chrome 80+, Firefox 113+, or Safari 16.4+)');
        const ds = new DecompressionStream('deflate-raw');
        const stream = new Blob([data]).stream().pipeThrough(ds);
        const buf = await new Response(stream).arrayBuffer();
        return new Uint8Array(buf);
    }

    async function zipEntryText(entry) {
        if (entry.method === 0) return td.decode(entry.data);
        if (entry.method === 8) return td.decode(await inflateRaw(entry.data));
        throw new Error('Unsupported ZIP compression method ' + entry.method);
    }

    /* ── DOCX text extraction (document.xml runs) ── */
    async function docxToText(bytes) {
        const entries = zipParse(bytes);
        const doc = entries.find(e => e.name === 'word/document.xml');
        if (!doc) throw new Error('No word/document.xml found — is this a valid .docx file?');
        const xml = await zipEntryText(doc);
        return xml
            .replace(/<w:tab[^>]*\/>/g, '\t')
            .replace(/<w:br[^>]*\/>/g, '\n')
            .replace(/<\/w:p>/g, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
    }

    /* ── PPTX text extraction (one block per slide) ── */
    async function pptxToText(bytes) {
        const entries = zipParse(bytes);
        const slides = entries
            .filter(e => /^ppt\/slides\/slide\d+\.xml$/.test(e.name))
            .sort((a, b) => parseInt(a.name.match(/\d+/)[0]) - parseInt(b.name.match(/\d+/)[0]));
        if (!slides.length) throw new Error('No slides found — is this a valid .pptx file?');
        let out = '';
        for (let i = 0; i < slides.length; i++) {
            const xml = await zipEntryText(slides[i]);
            const texts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m => m[1]);
            out += '--- Slide ' + (i + 1) + ' ---\n' + texts.join('\n')
                .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'") + '\n\n';
        }
        return out;
    }

    /* ── Minimal DOCX writer: array of text lines → .docx bytes ── */
    function docxFromLines(lines) {
        const escXml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
        const paras = lines.map(l =>
            '<w:p><w:r><w:t xml:space="preserve">' + escXml(l) + '</w:t></w:r></w:p>'
        ).join('');
        const contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
            '<Default Extension="xml" ContentType="application/xml"/>' +
            '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
            '</Types>';
        const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
            '</Relationships>';
        const document = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
            '<w:body>' + paras + '</w:body></w:document>';
        return zipStore([
            { name: '[Content_Types].xml', data: te.encode(contentTypes) },
            { name: '_rels/.rels', data: te.encode(rels) },
            { name: 'word/document.xml', data: te.encode(document) },
        ]);
    }

    /* ── BMP encoder: RGBA pixels → 24-bit BMP ── */
    function bmpEncode(width, height, rgba) {
        const rowSize = Math.ceil(width * 3 / 4) * 4;
        const dataSize = rowSize * height;
        const out = new Uint8Array(54 + dataSize);
        const v = new DataView(out.buffer);
        out[0] = 0x42; out[1] = 0x4D;             // 'BM'
        v.setUint32(2, out.length, true);
        v.setUint32(10, 54, true);                // pixel data offset
        v.setUint32(14, 40, true);                // BITMAPINFOHEADER
        v.setInt32(18, width, true);
        v.setInt32(22, height, true);             // positive = bottom-up
        v.setUint16(26, 1, true);                 // planes
        v.setUint16(28, 24, true);                // bpp
        v.setUint32(30, 0, true);                 // BI_RGB
        v.setUint32(34, dataSize, true);
        v.setInt32(38, 2835, true);               // 72 DPI
        v.setInt32(42, 2835, true);
        for (let y = 0; y < height; y++) {
            const srcRow = (height - 1 - y) * width * 4;  // bottom-up
            let p = 54 + y * rowSize;
            for (let x = 0; x < width; x++) {
                const s = srcRow + x * 4;
                out[p++] = rgba[s + 2];           // B
                out[p++] = rgba[s + 1];           // G
                out[p++] = rgba[s];               // R
            }
        }
        return out;
    }

    /* ── TIFF encoder: RGBA pixels → uncompressed RGB TIFF (little-endian) ── */
    function tiffEncode(width, height, rgba) {
        const pixLen = width * height * 3;
        const padded = pixLen + (pixLen % 2);     // keep IFD word-aligned
        const ifdOffset = 8 + padded;
        const tagCount = 12;
        const ifdSize = 2 + tagCount * 12 + 4;
        const extraOffset = ifdOffset + ifdSize;  // bits-per-sample + resolutions
        const out = new Uint8Array(extraOffset + 6 + 16);
        const v = new DataView(out.buffer);

        out[0] = 0x49; out[1] = 0x49;             // 'II' little-endian
        v.setUint16(2, 42, true);
        v.setUint32(4, ifdOffset, true);

        let p = 8;
        for (let i = 0; i < width * height; i++) {
            out[p++] = rgba[i * 4];
            out[p++] = rgba[i * 4 + 1];
            out[p++] = rgba[i * 4 + 2];
        }

        const bpsOffset = extraOffset;            // 3 x uint16
        const xresOffset = extraOffset + 6;       // rational
        const yresOffset = extraOffset + 14;      // rational

        p = ifdOffset;
        v.setUint16(p, tagCount, true); p += 2;
        const tag = (id, type, count, value) => {
            v.setUint16(p, id, true);
            v.setUint16(p + 2, type, true);
            v.setUint32(p + 4, count, true);
            v.setUint32(p + 8, value, true);
            p += 12;
        };
        tag(256, 4, 1, width);                    // ImageWidth
        tag(257, 4, 1, height);                   // ImageLength
        tag(258, 3, 3, bpsOffset);                // BitsPerSample → [8,8,8]
        tag(259, 3, 1, 1);                        // Compression: none
        tag(262, 3, 1, 2);                        // Photometric: RGB
        tag(273, 4, 1, 8);                        // StripOffsets
        tag(277, 3, 1, 3);                        // SamplesPerPixel
        tag(278, 4, 1, height);                   // RowsPerStrip
        tag(279, 4, 1, pixLen);                   // StripByteCounts
        tag(282, 5, 1, xresOffset);               // XResolution
        tag(283, 5, 1, yresOffset);               // YResolution
        tag(296, 3, 1, 2);                        // ResolutionUnit: inch
        v.setUint32(p, 0, true);                  // next IFD: none

        v.setUint16(bpsOffset, 8, true);
        v.setUint16(bpsOffset + 2, 8, true);
        v.setUint16(bpsOffset + 4, 8, true);
        v.setUint32(xresOffset, 72, true); v.setUint32(xresOffset + 4, 1, true);
        v.setUint32(yresOffset, 72, true); v.setUint32(yresOffset + 4, 1, true);
        return out;
    }

    /* ── CSV from PDF.js text items ──
       items: [{ str, width, transform }] → rows of cells using x/y positions */
    function itemsToCsvRows(items) {
        const placed = items
            .filter(it => it.str && it.str.trim() !== '')
            .map(it => ({ str: it.str, x: it.transform[4], y: it.transform[5], w: it.width || 0 }));
        // Cluster into rows by y (tolerance 3pt)
        const rows = [];
        for (const it of placed) {
            let row = rows.find(r => Math.abs(r.y - it.y) <= 3);
            if (!row) { row = { y: it.y, items: [] }; rows.push(row); }
            row.items.push(it);
        }
        rows.sort((a, b) => b.y - a.y);           // top of page first
        return rows.map(row => {
            row.items.sort((a, b) => a.x - b.x);
            const cells = [];
            let cur = null;
            let curEnd = 0;
            for (const it of row.items) {
                if (cur !== null && it.x - curEnd <= 6) {
                    cur += (it.x - curEnd > 1 ? ' ' : '') + it.str;
                } else {
                    if (cur !== null) cells.push(cur);
                    cur = it.str;
                }
                curEnd = it.x + it.w;
            }
            if (cur !== null) cells.push(cur);
            return cells;
        });
    }

    function csvEscape(cell) {
        return /[",\n\r]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell;
    }

    function rowsToCsv(rows) {
        return rows.map(r => r.map(c => csvEscape(c.trim())).join(',')).join('\r\n');
    }

    /* ── HTML → plain text (regex-based, no DOM needed) ── */
    function htmlToText(html) {
        return html
            .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/(p|div|h[1-6]|li|tr|table|section|article|header|footer|blockquote|pre)>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    /* ── RTF → plain text (best-effort, brace-depth parser) ── */
    function rtfToText(rtf) {
        let out = '';
        let i = 0;
        const n = rtf.length;
        const skipGroup = /^\\(fonttbl|colortbl|stylesheet|info|pict|themedata|\*)/;
        while (i < n) {
            const ch = rtf[i];
            if (ch === '{') {
                if (skipGroup.test(rtf.slice(i + 1, i + 16))) {
                    let d = 1; i++;
                    while (i < n && d > 0) { if (rtf[i] === '{') d++; else if (rtf[i] === '}') d--; i++; }
                    continue;
                }
                i++; continue;
            }
            if (ch === '}') { i++; continue; }
            if (ch === '\\') {
                const hx = /^\\'([0-9a-fA-F]{2})/.exec(rtf.slice(i, i + 4));
                if (hx) { out += String.fromCharCode(parseInt(hx[1], 16)); i += 4; continue; }
                if ('{}\\'.indexOf(rtf[i + 1]) !== -1) { out += rtf[i + 1]; i += 2; continue; }
                const m = /^\\([a-zA-Z]+)(-?\d+)? ?/.exec(rtf.slice(i, i + 32));
                if (m) {
                    if (m[1] === 'par' || m[1] === 'line') out += '\n';
                    else if (m[1] === 'tab') out += '\t';
                    else if (m[1] === 'u' && m[2]) {
                        out += String.fromCharCode(((+m[2]) + 65536) % 65536);
                        if (rtf[i + m[0].length] === '?') { i += m[0].length + 1; continue; }
                    }
                    i += m[0].length; continue;
                }
                i += 2; continue;
            }
            if (ch === '\r' || ch === '\n') { i++; continue; }
            out += ch; i++;
        }
        return out.replace(/\n{3,}/g, '\n\n').trim();
    }

    /* ── Base64 helpers that survive large inputs ── */
    function bytesToBase64(bytes) {
        let out = '';
        const CHUNK = 0x8000;
        for (let i = 0; i < bytes.length; i += CHUNK) {
            out += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
        }
        return btoa(out);
    }

    function base64ToBytes(b64) {
        const clean = b64.replace(/^data:[^;]+;base64,/, '').replace(/\s+/g, '');
        const binary = atob(clean);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
    }

    const BinUtils = {
        crc32, zipStore, zipParse, inflateRaw, zipEntryText,
        docxToText, pptxToText, docxFromLines,
        bmpEncode, tiffEncode,
        itemsToCsvRows, rowsToCsv, csvEscape,
        htmlToText, rtfToText,
        bytesToBase64, base64ToBytes,
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = BinUtils;
    else global.BinUtils = BinUtils;

})(typeof window !== 'undefined' ? window : globalThis);
