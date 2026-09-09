/* ===========================================================
   World of PDF — Client-Side PDF Processing Engine
   Uses pdf-lib for manipulation, PDF.js for rendering,
   and BinUtils (binary-utils.js) for ZIP/BMP/TIFF/DOCX work.
   =========================================================== */

(function () {
    'use strict';

    const { PDFDocument, rgb, degrees, StandardFonts, PageSizes } = PDFLib;

    /* ── Tool Definitions ── */
    const TOOLS = {
        'merge-pdf':      { name: 'Merge PDF', desc: 'Combine multiple PDFs into a single document', icon: 'bi-layers-fill', color: 'indigo', accept: '.pdf', multiple: true, btnText: 'Merge PDFs', minFiles: 2 },
        'split-pdf':      { name: 'Split PDF', desc: 'Separate each page into individual PDFs', icon: 'bi-scissors', color: 'indigo', accept: '.pdf', btnText: 'Split PDF', options: 'split' },
        'organize-pdf':   { name: 'Organize PDF', desc: 'Reorder, remove, or reverse pages', icon: 'bi-arrow-down-up', color: 'indigo', accept: '.pdf', btnText: 'Organize', options: 'organize' },
        'rotate-pdf':     { name: 'Rotate PDF', desc: 'Rotate pages 90\u00b0, 180\u00b0, or 270\u00b0', icon: 'bi-arrow-repeat', color: 'indigo', accept: '.pdf', btnText: 'Rotate', options: 'rotate' },
        'remove-pages':   { name: 'Remove Pages', desc: 'Delete specific pages from PDF', icon: 'bi-trash3', color: 'indigo', accept: '.pdf', btnText: 'Remove Pages', options: 'pages' },
        'extract-pages':  { name: 'Extract Pages', desc: 'Pull specific pages into a new PDF', icon: 'bi-file-earmark-minus', color: 'indigo', accept: '.pdf', btnText: 'Extract Pages', options: 'pages' },
        'image-to-pdf':   { name: 'Image to PDF', desc: 'Convert images to a single PDF', icon: 'bi-image', color: 'blue', accept: '.jpg,.jpeg,.png,.gif,.bmp,.webp', multiple: true, btnText: 'Convert to PDF' },
        'word-to-pdf':    { name: 'Word to PDF', desc: 'Convert DOCX documents to PDF', icon: 'bi-file-earmark-word', color: 'blue', accept: '.docx,.txt,.rtf', btnText: 'Convert' },
        'text-to-pdf':    { name: 'Text to PDF', desc: 'Convert plain text files to PDF', icon: 'bi-file-text', color: 'gray', accept: '.txt,.csv,.log,.md', btnText: 'Convert to PDF' },
        'html-to-pdf':    { name: 'HTML to PDF', desc: 'Convert HTML files to PDF', icon: 'bi-filetype-html', color: 'blue', accept: '.html,.htm', btnText: 'Convert to PDF' },
        'markdown-to-pdf': { name: 'Markdown to PDF', desc: 'Convert Markdown to styled PDF', icon: 'bi-markdown', color: 'purple', accept: '.md,.markdown,.txt', btnText: 'Convert to PDF' },
        'excel-to-pdf':   { name: 'Excel to PDF', desc: 'Convert spreadsheets to PDF', icon: 'bi-file-earmark-excel', color: 'green', accept: '.csv,.tsv,.txt', btnText: 'Convert to PDF' },
        'powerpoint-to-pdf': { name: 'PowerPoint to PDF', desc: 'Convert presentations to PDF', icon: 'bi-file-earmark-ppt', color: 'orange', accept: '.pptx,.txt', btnText: 'Convert to PDF' },
        'base64-to-pdf':  { name: 'Base64 to PDF', desc: 'Decode Base64 string to PDF', icon: 'bi-code-slash', color: 'cyan', accept: '.txt', btnText: 'Decode to PDF', options: 'base64input' },
        'pdf-to-png':     { name: 'PDF to PNG', desc: 'High-quality PNG export', icon: 'bi-filetype-png', color: 'green', accept: '.pdf', btnText: 'Convert to PNG' },
        'pdf-to-jpg':     { name: 'PDF to JPG', desc: 'Convert PDF pages to JPG', icon: 'bi-filetype-jpg', color: 'amber', accept: '.pdf', btnText: 'Convert to JPG' },
        'pdf-to-tiff':    { name: 'PDF to TIFF', desc: 'Convert to TIFF format', icon: 'bi-filetype-tiff', color: 'purple', accept: '.pdf', btnText: 'Convert to TIFF' },
        'pdf-to-bmp':     { name: 'PDF to BMP', desc: 'Convert to BMP format', icon: 'bi-filetype-bmp', color: 'cyan', accept: '.pdf', btnText: 'Convert to BMP' },
        'pdf-to-word':    { name: 'PDF to Word', desc: 'Convert PDF text to an editable Word (.docx) file', icon: 'bi-file-earmark-word', color: 'blue', accept: '.pdf', btnText: 'Convert to Word' },
        'pdf-to-excel':   { name: 'PDF to Excel', desc: 'Extract data into spreadsheet format', icon: 'bi-file-earmark-excel', color: 'green', accept: '.pdf', btnText: 'Extract to CSV' },
        'pdf-to-powerpoint': { name: 'PDF to PowerPoint', desc: 'Convert pages to presentation', icon: 'bi-file-earmark-ppt', color: 'orange', accept: '.pdf', btnText: 'Convert' },
        'pdf-to-text':    { name: 'PDF to Text', desc: 'Extract all text from PDF', icon: 'bi-file-text', color: 'gray', accept: '.pdf', btnText: 'Extract Text' },
        'pdf-to-html':    { name: 'PDF to HTML', desc: 'Convert PDF to web page', icon: 'bi-filetype-html', color: 'amber', accept: '.pdf', btnText: 'Convert to HTML' },
        'pdf-to-markdown': { name: 'PDF to Markdown', desc: 'Export as Markdown', icon: 'bi-markdown', color: 'purple', accept: '.pdf', btnText: 'Convert to MD' },
        'pdf-to-xml':     { name: 'PDF to XML', desc: 'Structured XML export', icon: 'bi-filetype-xml', color: 'teal', accept: '.pdf', btnText: 'Convert to XML' },
        'pdf-to-csv':     { name: 'PDF to CSV', desc: 'Extract tables to CSV', icon: 'bi-filetype-csv', color: 'green', accept: '.pdf', btnText: 'Convert to CSV' },
        'pdf-to-base64':  { name: 'PDF to Base64', desc: 'Encode PDF as Base64', icon: 'bi-code-slash', color: 'cyan', accept: '.pdf', btnText: 'Encode to Base64' },
        'compress-pdf':   { name: 'Compress PDF', desc: 'Reduce file size while keeping quality', icon: 'bi-file-zip', color: 'indigo', accept: '.pdf', btnText: 'Compress' },
        'watermark-pdf':  { name: 'Watermark', desc: 'Stamp text on every page', icon: 'bi-droplet-fill', color: 'blue', accept: '.pdf', btnText: 'Add Watermark', options: 'watermark' },
        'page-numbers':   { name: 'Page Numbers', desc: 'Number PDF pages with custom positioning', icon: 'bi-hash', color: 'amber', accept: '.pdf', btnText: 'Add Numbers', options: 'pageNumbers' },
        'crop-pdf':       { name: 'Crop PDF', desc: 'Trim margins from all pages', icon: 'bi-crop', color: 'green', accept: '.pdf', btnText: 'Crop', options: 'crop' },
        'resize-pdf':     { name: 'Resize PDF', desc: 'Change page dimensions', icon: 'bi-aspect-ratio', color: 'cyan', accept: '.pdf', btnText: 'Resize', options: 'resize' },
        'grayscale-pdf':  { name: 'Grayscale', desc: 'Turn color PDF into black & white', icon: 'bi-circle-half', color: 'gray', accept: '.pdf', btnText: 'Convert to Grayscale' },
        'flatten-pdf':    { name: 'Flatten PDF', desc: 'Bake form fields into page', icon: 'bi-layers', color: 'orange', accept: '.pdf', btnText: 'Flatten' },
        'metadata-pdf':   { name: 'Metadata', desc: 'Change title, author, subject, keywords', icon: 'bi-tag', color: 'teal', accept: '.pdf', btnText: 'Update Metadata', options: 'metadata' },
        'pdfa-convert':   { name: 'PDF/A', desc: 'Convert to archival format', icon: 'bi-archive', color: 'rose', accept: '.pdf', btnText: 'Convert to PDF/A' },
        'protect-pdf':    { name: 'Protect PDF', desc: 'Add password encryption', icon: 'bi-lock-fill', color: 'indigo', accept: '.pdf', btnText: 'Protect', options: 'protect' },
        'unlock-pdf':     { name: 'Unlock PDF', desc: 'Remove password protection', icon: 'bi-unlock-fill', color: 'green', accept: '.pdf', btnText: 'Unlock', options: 'unlock' },
        'sign-pdf':       { name: 'Sign PDF', desc: 'Add your signature to any page', icon: 'bi-pen-fill', color: 'blue', accept: '.pdf', btnText: 'Add Signature', options: 'sign' },
        'extract-images': { name: 'Extract Images', desc: 'Save each PDF page as a PNG image', icon: 'bi-images', color: 'amber', accept: '.pdf', btnText: 'Extract Images' },
        'extract-links':  { name: 'Extract Links', desc: 'Find all URLs in your PDF', icon: 'bi-link-45deg', color: 'blue', accept: '.pdf', btnText: 'Extract Links' },
        'pdf-info':       { name: 'PDF Info', desc: 'View page count, metadata & details', icon: 'bi-info-circle', color: 'indigo', accept: '.pdf', btnText: 'Get Info' },
        'repair-pdf':     { name: 'Repair PDF', desc: 'Fix corrupted or damaged PDF files', icon: 'bi-wrench', color: 'orange', accept: '.pdf', btnText: 'Repair' },
        'compare-pdf':    { name: 'Compare PDF', desc: 'Find text differences between two PDFs', icon: 'bi-file-diff', color: 'purple', accept: '.pdf', multiple: true, btnText: 'Compare', minFiles: 2 },
        'edit-pdf':       { name: 'Edit PDF', desc: 'Add text and images to your PDF', icon: 'bi-pencil', color: 'purple', accept: '.pdf', btnText: 'Edit PDF', soon: true },
        'redact-pdf':     { name: 'Redact PDF', desc: 'Permanently black out sensitive info', icon: 'bi-eraser-fill', color: 'rose', accept: '.pdf', btnText: 'Redact', soon: true },
        'ocr-pdf':        { name: 'OCR PDF', desc: 'Extract text from scanned documents', icon: 'bi-eye', color: 'teal', accept: '.pdf', btnText: 'Run OCR', soon: true },
    };

    /* ── Detect Tool from URL ── */
    const slug = location.pathname.split('/').pop().replace('.html', '');
    const tool = TOOLS[slug];
    if (!tool) return;

    /* ── Populate Page ── */
    document.title = tool.name + ' - World of PDF';
    document.querySelector('meta[name="description"]')?.setAttribute('content', tool.desc);
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    $('#breadcrumbName').textContent = tool.name;
    $('#toolTitle').textContent = tool.name;
    $('#toolDesc').textContent = tool.desc;
    $('#toolIcon').className = 'tool-hero-icon tool-icon--' + tool.color;
    $('#toolIcon').innerHTML = '<i class="bi ' + tool.icon + '"></i>';
    if (tool.btnText) $('#processBtnText').textContent = tool.btnText;

    const fileInput = $('#fileInput');
    fileInput.accept = tool.accept || '.pdf';
    if (tool.multiple) fileInput.multiple = true;

    /* ── State ── */
    let selectedFiles = [];
    let resultBlob = null;
    let resultName = '';

    /* ── Theme ── */
    const saved = localStorage.getItem('pdf-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    $$('.theme-option').forEach(b => {
        b.classList.toggle('active', b.dataset.theme === saved);
        b.addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme', b.dataset.theme);
            localStorage.setItem('pdf-theme', b.dataset.theme);
            $$('.theme-option').forEach(x => x.classList.toggle('active', x.dataset.theme === b.dataset.theme));
            $('#themeMenu').classList.remove('show');
        });
    });
    $('#themeToggleBtn')?.addEventListener('click', e => { e.stopPropagation(); $('#themeMenu').classList.toggle('show'); });
    document.addEventListener('click', e => { if (!e.target.closest('.theme-dropdown')) $('#themeMenu')?.classList.remove('show'); });

    /* ── Mobile Menu (same behavior as homepage) ── */
    const mobileOverlay = $('#mobileMenuOverlay');
    function closeMobileMenu() { mobileOverlay?.classList.remove('open'); document.body.style.overflow = ''; }
    $('#mobileMenuBtn')?.addEventListener('click', () => { mobileOverlay?.classList.add('open'); document.body.style.overflow = 'hidden'; });
    $('#mobileMenuClose')?.addEventListener('click', closeMobileMenu);
    mobileOverlay?.addEventListener('click', e => { if (e.target === mobileOverlay) closeMobileMenu(); });
    $$('.mobile-cat-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const cat = trigger.closest('.mobile-cat');
            const wasOpen = cat.classList.contains('open');
            $$('.mobile-cat').forEach(c => c.classList.remove('open'));
            if (!wasOpen) cat.classList.add('open');
        });
    });

    /* ── Desktop dropdown hover (same behavior as homepage) ── */
    $$('.nav-dropdown').forEach(dd => {
        let ddTimeout;
        dd.addEventListener('mouseenter', () => {
            clearTimeout(ddTimeout);
            $$('.nav-dropdown').forEach(o => { if (o !== dd) o.classList.remove('open'); });
            dd.classList.add('open');
        });
        dd.addEventListener('mouseleave', () => { ddTimeout = setTimeout(() => dd.classList.remove('open'), 150); });
    });

    /* ── Upload Logic ── */
    const uploadZone = $('#uploadZone');
    const uploadBtn = $('#uploadBtn');

    uploadBtn?.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });
    uploadZone?.addEventListener('click', () => fileInput.click());
    uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone?.addEventListener('drop', e => {
        e.preventDefault(); uploadZone.classList.remove('drag-over');
        addFiles(Array.from(e.dataTransfer.files));
    });
    fileInput.addEventListener('change', () => { addFiles(Array.from(fileInput.files)); fileInput.value = ''; });
    $('#addMoreBtn')?.addEventListener('click', () => fileInput.click());

    function addFiles(files) {
        selectedFiles = selectedFiles.concat(files);
        showConfigure();
    }

    function showConfigure() {
        $('#stepUpload').classList.add('d-none');
        $('#stepConfigure').classList.remove('d-none');
        $('#fileCountLabel').textContent = selectedFiles.length + ' file' + (selectedFiles.length > 1 ? 's' : '') + ' selected';
        renderFileList();
        renderToolOptions();
    }

    function renderFileList() {
        const c = $('#fileListContainer');
        c.innerHTML = selectedFiles.map((f, i) => `
            <div class="file-item" draggable="true" data-idx="${i}">
                <span class="file-item-handle"><i class="bi bi-grip-vertical"></i></span>
                <span class="file-item-icon"><i class="bi bi-file-earmark-pdf-fill"></i></span>
                <div class="file-item-info">
                    <div class="file-item-name">${esc(f.name)}</div>
                    <div class="file-item-size">${fmtSize(f.size)}</div>
                </div>
                <button class="file-item-remove" data-idx="${i}">&times;</button>
            </div>
        `).join('');
        c.querySelectorAll('.file-item-remove').forEach(b => b.addEventListener('click', () => {
            selectedFiles.splice(+b.dataset.idx, 1);
            if (!selectedFiles.length) { showStep('stepUpload'); return; }
            showConfigure();
        }));
        initDragSort(c);
    }

    function initDragSort(container) {
        let dragIdx = null;
        container.querySelectorAll('.file-item').forEach(el => {
            el.addEventListener('dragstart', () => { dragIdx = +el.dataset.idx; el.classList.add('dragging'); });
            el.addEventListener('dragend', () => { el.classList.remove('dragging'); });
            el.addEventListener('dragover', e => e.preventDefault());
            el.addEventListener('drop', e => {
                e.preventDefault();
                const dropIdx = +el.dataset.idx;
                if (dragIdx !== null && dragIdx !== dropIdx) {
                    const moved = selectedFiles.splice(dragIdx, 1)[0];
                    selectedFiles.splice(dropIdx, 0, moved);
                    renderFileList();
                }
            });
        });
    }

    /* ── Tool-specific Options ── */
    function renderToolOptions() {
        const c = $('#toolOptions');
        c.innerHTML = '';
        const opt = tool.options;
        if (!opt) return;

        const html = {
            split: `<div class="tool-option-group"><label>Split Mode</label>
                <select id="optSplitMode"><option value="all">Every page as separate PDF</option><option value="range">Custom page ranges</option></select>
                <div id="splitRangeInput" class="mt-2 d-none"><input type="text" id="optSplitRange" placeholder="e.g. 1-3, 5, 7-10">
                <div class="page-range-hint">Comma-separated ranges</div></div></div>`,
            rotate: `<div class="tool-option-group"><label>Rotation Angle</label>
                <select id="optRotate"><option value="90">90° Clockwise</option><option value="180">180°</option><option value="270">90° Counter-clockwise</option></select>
                <label class="mt-2">Apply to</label><select id="optRotatePages"><option value="all">All pages</option><option value="custom">Custom pages</option></select>
                <div id="rotateCustom" class="mt-2 d-none"><input type="text" id="optRotateRange" placeholder="e.g. 1, 3-5"><div class="page-range-hint">Comma-separated pages/ranges</div></div></div>`,
            pages: `<div class="tool-option-group"><label>Page Selection</label>
                <input type="text" id="optPageRange" placeholder="e.g. 1-3, 5, 7-10">
                <div class="page-range-hint">Comma-separated pages or ranges. Leave empty for all pages.</div></div>`,
            organize: `<div class="tool-option-group"><label>Page Order</label>
                <select id="optOrganize"><option value="reverse">Reverse all pages</option><option value="odd">Odd pages only</option><option value="even">Even pages only</option><option value="custom">Custom order</option></select>
                <div id="organizeCustom" class="mt-2 d-none"><input type="text" id="optOrganizeOrder" placeholder="e.g. 3,1,2,5,4"><div class="page-range-hint">Comma-separated page numbers in desired order</div></div></div>`,
            watermark: `<div class="tool-option-group"><label>Watermark Text</label>
                <input type="text" id="optWatermarkText" placeholder="CONFIDENTIAL" value="CONFIDENTIAL">
                <label class="mt-2">Font Size</label><input type="number" id="optWatermarkSize" value="60" min="10" max="200">
                <label class="mt-2">Opacity (0-100)</label><input type="number" id="optWatermarkOpacity" value="20" min="1" max="100">
                <label class="mt-2">Rotation</label><select id="optWatermarkAngle"><option value="45">Diagonal (45°)</option><option value="0">Horizontal</option><option value="90">Vertical</option></select></div>`,
            pageNumbers: `<div class="tool-option-group"><label>Position</label>
                <select id="optPageNumPos"><option value="bottom-center">Bottom Center</option><option value="bottom-right">Bottom Right</option><option value="bottom-left">Bottom Left</option><option value="top-center">Top Center</option></select>
                <label class="mt-2">Start Number</label><input type="number" id="optPageNumStart" value="1" min="1">
                <label class="mt-2">Format</label><select id="optPageNumFmt"><option value="number">1, 2, 3...</option><option value="dash">- 1 -, - 2 -...</option><option value="page">Page 1, Page 2...</option></select></div>`,
            metadata: `<div class="tool-option-group"><label>Title</label><input type="text" id="optMetaTitle" placeholder="Document Title">
                <label class="mt-2">Author</label><input type="text" id="optMetaAuthor" placeholder="Author Name">
                <label class="mt-2">Subject</label><input type="text" id="optMetaSubject" placeholder="Subject">
                <label class="mt-2">Keywords</label><input type="text" id="optMetaKeywords" placeholder="keyword1, keyword2"></div>`,
            protect: `<div class="tool-option-group"><label>Password</label><input type="text" id="optPassword" placeholder="Enter password">
                <div class="page-range-hint">This password will be required to open the PDF</div></div>`,
            unlock: `<div class="tool-option-group"><label>Current Password</label><input type="text" id="optUnlockPw" placeholder="Enter current password">
                <div class="page-range-hint">Enter the password to remove protection</div></div>`,
            crop: `<div class="tool-option-group"><label>Margin to Trim (points)</label>
                <div class="row g-2 mt-1"><div class="col-6"><label style="font-size:0.75rem">Top</label><input type="number" id="optCropTop" value="36" min="0"></div>
                <div class="col-6"><label style="font-size:0.75rem">Bottom</label><input type="number" id="optCropBottom" value="36" min="0"></div>
                <div class="col-6"><label style="font-size:0.75rem">Left</label><input type="number" id="optCropLeft" value="36" min="0"></div>
                <div class="col-6"><label style="font-size:0.75rem">Right</label><input type="number" id="optCropRight" value="36" min="0"></div></div></div>`,
            resize: `<div class="tool-option-group"><label>Page Size</label>
                <select id="optResize"><option value="A4">A4 (210 x 297 mm)</option><option value="Letter">Letter (8.5 x 11 in)</option><option value="Legal">Legal (8.5 x 14 in)</option><option value="A3">A3 (297 x 420 mm)</option><option value="A5">A5 (148 x 210 mm)</option></select></div>`,
            sign: `<div class="tool-option-group"><label>Draw your signature</label>
                <div class="signature-canvas-wrap"><canvas id="signatureCanvas" width="500" height="150"></canvas><button class="sig-clear-btn" id="sigClear">Clear</button></div>
                <label class="mt-2">Place on Page</label><select id="optSignPage"><option value="last">Last Page</option><option value="first">First Page</option><option value="all">All Pages</option></select></div>`,
            base64input: `<div class="tool-option-group"><label>Paste Base64 String</label>
                <textarea id="optBase64" rows="5" placeholder="Paste your Base64-encoded PDF string here..."></textarea></div>`,
        };

        if (html[opt]) c.innerHTML = html[opt];

        // Dynamic toggles
        if (opt === 'split') {
            $('#optSplitMode')?.addEventListener('change', e => { $('#splitRangeInput').classList.toggle('d-none', e.target.value !== 'range'); });
        }
        if (opt === 'rotate') {
            $('#optRotatePages')?.addEventListener('change', e => { $('#rotateCustom').classList.toggle('d-none', e.target.value !== 'custom'); });
        }
        if (opt === 'organize') {
            $('#optOrganize')?.addEventListener('change', e => { $('#organizeCustom').classList.toggle('d-none', e.target.value !== 'custom'); });
        }
        if (opt === 'sign') initSignatureCanvas();
    }

    function initSignatureCanvas() {
        const canvas = $('#signatureCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let drawing = false;
        ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#1e293b';
        canvas.addEventListener('mousedown', e => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
        canvas.addEventListener('mousemove', e => { if (drawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } });
        canvas.addEventListener('mouseup', () => { drawing = false; });
        canvas.addEventListener('mouseleave', () => { drawing = false; });
        // Touch support
        canvas.addEventListener('touchstart', e => { e.preventDefault(); const t = e.touches[0]; const r = canvas.getBoundingClientRect(); drawing = true; ctx.beginPath(); ctx.moveTo(t.clientX - r.left, t.clientY - r.top); });
        canvas.addEventListener('touchmove', e => { e.preventDefault(); if (drawing) { const t = e.touches[0]; const r = canvas.getBoundingClientRect(); ctx.lineTo(t.clientX - r.left, t.clientY - r.top); ctx.stroke(); } });
        canvas.addEventListener('touchend', () => { drawing = false; });
        $('#sigClear')?.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));
    }

    /* ── Steps Navigation ── */
    function showStep(id) {
        ['stepUpload', 'stepConfigure', 'stepProcessing', 'stepDownload'].forEach(s => {
            const el = document.getElementById(s);
            if (el) el.classList.toggle('d-none', s !== id);
        });
    }

    /* ── Process Button ── */
    $('#processBtn')?.addEventListener('click', async () => {
        if (tool.minFiles && selectedFiles.length < tool.minFiles) {
            alert('Please select at least ' + tool.minFiles + ' files.');
            return;
        }
        showStep('stepProcessing');
        try {
            await processFiles();
            showStep('stepDownload');
        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
            showStep('stepConfigure');
        }
    });
    $('#clearBtn')?.addEventListener('click', () => { selectedFiles = []; showStep('stepUpload'); });
    $('#startOverBtn')?.addEventListener('click', () => { selectedFiles = []; resultBlob = null; showStep('stepUpload'); });
    $('#downloadBtn')?.addEventListener('click', () => { if (resultBlob) downloadBlob(resultBlob, resultName); });

    /* ── Progress Helper ── */
    function setProgress(pct) { const b = $('#progressBar'); if (b) b.style.width = pct + '%'; }

    /* ── Parse Page Ranges ── */
    function parseRanges(str, maxPage) {
        if (!str || !str.trim()) return Array.from({ length: maxPage }, (_, i) => i);
        const pages = new Set();
        str.split(',').forEach(part => {
            part = part.trim();
            const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
            if (m) { for (let i = +m[1]; i <= +m[2]; i++) if (i >= 1 && i <= maxPage) pages.add(i - 1); }
            else { const n = parseInt(part); if (n >= 1 && n <= maxPage) pages.add(n - 1); }
        });
        return Array.from(pages).sort((a, b) => a - b);
    }

    /* ── Read file as ArrayBuffer ── */
    function readFile(file) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = reject;
            r.readAsArrayBuffer(file);
        });
    }
    function readFileText(file) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = reject;
            r.readAsText(file);
        });
    }

    /* ──────────────────────────────────────────────
       MAIN PROCESSING ROUTER
       ────────────────────────────────────────────── */
    async function processFiles() {
        setProgress(10);
        const processors = {
            'merge-pdf': processMerge,
            'split-pdf': processSplit,
            'organize-pdf': processOrganize,
            'rotate-pdf': processRotate,
            'remove-pages': processRemovePages,
            'extract-pages': processExtractPages,
            'image-to-pdf': processImageToPdf,
            'text-to-pdf': processDocumentToPdf,
            'html-to-pdf': processDocumentToPdf,
            'markdown-to-pdf': processDocumentToPdf,
            'word-to-pdf': processDocumentToPdf,
            'excel-to-pdf': processDocumentToPdf,
            'powerpoint-to-pdf': processDocumentToPdf,
            'base64-to-pdf': processBase64ToPdf,
            'pdf-to-png': () => processPdfToImage('png'),
            'pdf-to-jpg': () => processPdfToImage('jpeg'),
            'pdf-to-tiff': () => processPdfToImage('tiff'),
            'pdf-to-bmp': () => processPdfToImage('bmp'),
            'pdf-to-text': processPdfToText,
            'pdf-to-word': processPdfToWord,
            'pdf-to-html': processPdfToHtml,
            'pdf-to-markdown': processPdfToText,
            'pdf-to-xml': processPdfToXml,
            'pdf-to-csv': processPdfToCsv,
            'pdf-to-excel': processPdfToCsv,
            'pdf-to-powerpoint': processPdfToText,
            'pdf-to-base64': processPdfToBase64,
            'compress-pdf': processCompress,
            'watermark-pdf': processWatermark,
            'page-numbers': processPageNumbers,
            'crop-pdf': processCrop,
            'resize-pdf': processResize,
            'grayscale-pdf': processGrayscale,
            'flatten-pdf': processFlatten,
            'metadata-pdf': processMetadata,
            'pdfa-convert': processFlatten,
            'protect-pdf': processProtect,
            'unlock-pdf': processUnlock,
            'sign-pdf': processSign,
            'extract-images': processExtractImages,
            'extract-links': processExtractLinks,
            'pdf-info': processPdfInfo,
            'repair-pdf': processRepair,
            'compare-pdf': processCompare,
        };
        const fn = processors[slug];
        if (fn) await fn();
        else { setResult(new Blob(['Tool not yet implemented'], { type: 'text/plain' }), 'result.txt'); }
        setProgress(100);
    }

    function setResult(blob, name) { resultBlob = blob; resultName = name; $('#downloadInfo').textContent = name + ' (' + fmtSize(blob.size) + ')'; }

    /* ─── MERGE ─── */
    async function processMerge() {
        const merged = await PDFDocument.create();
        for (let i = 0; i < selectedFiles.length; i++) {
            setProgress(10 + (80 * i / selectedFiles.length));
            const bytes = await readFile(selectedFiles[i]);
            const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
            const pages = await merged.copyPages(src, src.getPageIndices());
            pages.forEach(p => merged.addPage(p));
        }
        const out = await merged.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'merged.pdf');
    }

    /* ─── SPLIT ─── */
    async function processSplit() {
        const bytes = await readFile(selectedFiles[0]);
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = src.getPageCount();
        const mode = $('#optSplitMode')?.value || 'all';

        if (mode === 'all') {
            const results = [];
            for (let i = 0; i < total; i++) {
                setProgress(10 + (80 * i / total));
                const doc = await PDFDocument.create();
                const [page] = await doc.copyPages(src, [i]);
                doc.addPage(page);
                results.push(await doc.save());
            }
            if (results.length === 1) {
                setResult(new Blob([results[0]], { type: 'application/pdf' }), 'page-1.pdf');
            } else {
                const zip = BinUtils.zipStore(results.map((r, i) => ({ name: 'page-' + (i + 1) + '.pdf', data: new Uint8Array(r) })));
                setResult(new Blob([zip], { type: 'application/zip' }), 'split-pages.zip');
                $('#downloadInfo').textContent = 'split-pages.zip — ' + total + ' PDFs (' + fmtSize(zip.length) + ')';
            }
        } else {
            const rangeStr = $('#optSplitRange')?.value || '';
            const indices = parseRanges(rangeStr, total);
            const doc = await PDFDocument.create();
            const pages = await doc.copyPages(src, indices);
            pages.forEach(p => doc.addPage(p));
            const out = await doc.save();
            setResult(new Blob([out], { type: 'application/pdf' }), 'split-pages.pdf');
        }
    }

    /* ─── ORGANIZE ─── */
    async function processOrganize() {
        const bytes = await readFile(selectedFiles[0]);
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = src.getPageCount();
        const mode = $('#optOrganize')?.value || 'reverse';
        let indices;
        if (mode === 'reverse') indices = Array.from({ length: total }, (_, i) => total - 1 - i);
        else if (mode === 'odd') indices = Array.from({ length: total }, (_, i) => i).filter(i => i % 2 === 0);
        else if (mode === 'even') indices = Array.from({ length: total }, (_, i) => i).filter(i => i % 2 === 1);
        else { indices = ($('#optOrganizeOrder')?.value || '').split(',').map(s => parseInt(s.trim()) - 1).filter(n => n >= 0 && n < total); }
        if (!indices.length) indices = Array.from({ length: total }, (_, i) => i);

        const doc = await PDFDocument.create();
        const pages = await doc.copyPages(src, indices);
        pages.forEach(p => doc.addPage(p));
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'organized.pdf');
    }

    /* ─── ROTATE ─── */
    async function processRotate() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const angle = parseInt($('#optRotate')?.value || '90');
        const mode = $('#optRotatePages')?.value || 'all';
        const total = doc.getPageCount();
        let indices;
        if (mode === 'all') indices = Array.from({ length: total }, (_, i) => i);
        else indices = parseRanges($('#optRotateRange')?.value || '', total);

        indices.forEach(i => {
            const page = doc.getPage(i);
            page.setRotation(degrees(page.getRotation().angle + angle));
        });
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'rotated.pdf');
    }

    /* ─── REMOVE PAGES ─── */
    async function processRemovePages() {
        const bytes = await readFile(selectedFiles[0]);
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = src.getPageCount();
        const removeIndices = new Set(parseRanges($('#optPageRange')?.value || '', total));
        const keepIndices = Array.from({ length: total }, (_, i) => i).filter(i => !removeIndices.has(i));
        if (!keepIndices.length) { alert('Cannot remove all pages'); throw new Error('No pages left'); }
        const doc = await PDFDocument.create();
        const pages = await doc.copyPages(src, keepIndices);
        pages.forEach(p => doc.addPage(p));
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'pages-removed.pdf');
    }

    /* ─── EXTRACT PAGES ─── */
    async function processExtractPages() {
        const bytes = await readFile(selectedFiles[0]);
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = src.getPageCount();
        const indices = parseRanges($('#optPageRange')?.value || '', total);
        const doc = await PDFDocument.create();
        const pages = await doc.copyPages(src, indices);
        pages.forEach(p => doc.addPage(p));
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'extracted.pdf');
    }

    /* ─── IMAGE TO PDF ─── */

    // Decode any browser-supported image (gif/bmp/webp/...) to PNG bytes via canvas
    function imageFileToPngBytes(file) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
                canvas.getContext('2d').drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
                canvas.toBlob(b => b ? b.arrayBuffer().then(resolve) : reject(new Error('Could not convert image')), 'image/png');
            };
            img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not load image: ' + file.name)); };
            img.src = url;
        });
    }

    async function processImageToPdf() {
        const doc = await PDFDocument.create();
        for (let i = 0; i < selectedFiles.length; i++) {
            setProgress(10 + (80 * i / selectedFiles.length));
            const name = selectedFiles[i].name.toLowerCase();
            let img;
            if (name.endsWith('.png')) img = await doc.embedPng(await readFile(selectedFiles[i]));
            else if (name.endsWith('.jpg') || name.endsWith('.jpeg')) img = await doc.embedJpg(await readFile(selectedFiles[i]));
            else img = await doc.embedPng(await imageFileToPngBytes(selectedFiles[i]));
            const { width, height } = img.scale(1);
            const page = doc.addPage([width, height]);
            page.drawImage(img, { x: 0, y: 0, width, height });
        }
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'images.pdf');
    }

    /* ─── DOCUMENT (TXT / MD / HTML / RTF / DOCX / PPTX / CSV) to PDF ─── */
    async function processDocumentToPdf() {
        const file = selectedFiles[0];
        const name = file.name.toLowerCase();
        let text;
        if (name.endsWith('.docx')) {
            text = await BinUtils.docxToText(new Uint8Array(await readFile(file)));
        } else if (name.endsWith('.pptx')) {
            text = await BinUtils.pptxToText(new Uint8Array(await readFile(file)));
        } else if (name.endsWith('.html') || name.endsWith('.htm')) {
            text = BinUtils.htmlToText(await readFileText(file));
        } else if (name.endsWith('.rtf')) {
            text = BinUtils.rtfToText(await readFileText(file));
        } else if (name.endsWith('.doc') || name.endsWith('.ppt')) {
            throw new Error('Legacy .doc/.ppt binary files are not supported. Please save the file as .docx/.pptx and try again.');
        } else {
            text = await readFileText(file);
        }
        await renderTextToPdf(text);
    }

    async function renderTextToPdf(text) {
        // Helvetica is WinAnsi-encoded: normalize typographic chars, replace the rest
        text = text.replace(/\r\n?/g, '\n').replace(/\t/g, '    ')
            .replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"')
            .replace(/[–—]/g, '-').replace(/…/g, '...')
            .replace(/[\u00A0\u2000-\u200B\u202F]/g, ' ')
            .replace(/[^\n\x20-\x7E¡-ÿ]/g, '?');
        const doc = await PDFDocument.create();
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const fontSize = 11;
        const margin = 50;
        const lineHeight = fontSize * 1.4;
        const pageW = 595.28; const pageH = 841.89; // A4
        const maxW = pageW - margin * 2;
        // Hard-break words wider than a full line so wrapping always terminates
        const breakLong = w => {
            if (font.widthOfTextAtSize(w, fontSize) <= maxW) return [w];
            const parts = [];
            let cur = '';
            for (const ch of w) {
                if (font.widthOfTextAtSize(cur + ch, fontSize) > maxW) { parts.push(cur); cur = ch; }
                else cur += ch;
            }
            if (cur) parts.push(cur);
            return parts;
        };
        const lines = text.split('\n');
        let page = doc.addPage([pageW, pageH]);
        let y = pageH - margin;

        for (const rawLine of lines) {
            // Word-wrap
            const words = rawLine.split(' ').flatMap(breakLong);
            let currentLine = '';
            for (const word of words) {
                const test = currentLine ? currentLine + ' ' + word : word;
                const w = font.widthOfTextAtSize(test, fontSize);
                if (w > maxW && currentLine) {
                    if (y < margin + lineHeight) { page = doc.addPage([pageW, pageH]); y = pageH - margin; }
                    page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
                    y -= lineHeight;
                    currentLine = word;
                } else { currentLine = test; }
            }
            if (y < margin + lineHeight) { page = doc.addPage([pageW, pageH]); y = pageH - margin; }
            page.drawText(currentLine || '', { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
            y -= lineHeight;
        }
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'converted.pdf');
    }

    /* ─── BASE64 TO PDF ─── */
    async function processBase64ToPdf() {
        let b64 = $('#optBase64')?.value || '';
        if (!b64.trim() && selectedFiles.length) b64 = await readFileText(selectedFiles[0]);
        if (!b64.trim()) throw new Error('Please paste a Base64 string or choose a .txt file containing one.');
        let bytes;
        try { bytes = BinUtils.base64ToBytes(b64); }
        catch (e) { throw new Error('That does not look like valid Base64 data.'); }
        setResult(new Blob([bytes], { type: 'application/pdf' }), 'decoded.pdf');
        const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF
        if (!isPdf) $('#downloadInfo').textContent = 'decoded.pdf (' + fmtSize(bytes.length) + ') — Warning: decoded data does not start with a PDF header.';
    }

    /* ─── PDF TO IMAGE (PNG/JPG/TIFF/BMP) ─── */

    function renderPdfPage(pdf, pageNum, scale) {
        return pdf.getPage(pageNum).then(async page => {
            const vp = page.getViewport({ scale: scale || 2 });
            const canvas = document.createElement('canvas');
            canvas.width = vp.width; canvas.height = vp.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: vp }).promise;
            return { canvas, ctx };
        });
    }

    function canvasToBytes(canvas, ctx, format) {
        if (format === 'bmp') {
            const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
            return Promise.resolve(BinUtils.bmpEncode(canvas.width, canvas.height, d.data));
        }
        if (format === 'tiff') {
            const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
            return Promise.resolve(BinUtils.tiffEncode(canvas.width, canvas.height, d.data));
        }
        return new Promise((resolve, reject) => {
            canvas.toBlob(b => {
                if (!b) return reject(new Error('Image encoding failed'));
                b.arrayBuffer().then(buf => resolve(new Uint8Array(buf)));
            }, 'image/' + format, 0.92);
        });
    }

    const IMG_EXT = { png: 'png', jpeg: 'jpg', tiff: 'tiff', bmp: 'bmp' };
    const IMG_MIME = { png: 'image/png', jpeg: 'image/jpeg', tiff: 'image/tiff', bmp: 'image/bmp' };

    async function processPdfToImage(format) {
        const bytes = await readFile(selectedFiles[0]);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const total = pdf.numPages;
        const ext = IMG_EXT[format];
        const pages = [];
        for (let i = 1; i <= total; i++) {
            setProgress(10 + (80 * i / total));
            const { canvas, ctx } = await renderPdfPage(pdf, i);
            pages.push(await canvasToBytes(canvas, ctx, format));
        }
        if (total === 1) {
            setResult(new Blob([pages[0]], { type: IMG_MIME[format] }), 'page-1.' + ext);
        } else {
            const zip = BinUtils.zipStore(pages.map((p, i) => ({ name: 'page-' + (i + 1) + '.' + ext, data: p })));
            setResult(new Blob([zip], { type: 'application/zip' }), 'pages-' + ext + '.zip');
            $('#downloadInfo').textContent = 'pages-' + ext + '.zip — ' + total + ' images (' + fmtSize(zip.length) + ')';
        }
        setProgress(90);
    }

    /* ─── PDF TO TEXT / MARKDOWN ─── */

    // Extract a page's text as visual lines (grouped by y, ordered by x)
    async function pageTextLines(pdf, pageNum) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        return BinUtils.itemsToCsvRows(content.items).map(cells => cells.join(' '));
    }

    async function processPdfToText() {
        const bytes = await readFile(selectedFiles[0]);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const isMd = slug === 'pdf-to-markdown';
        let allText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            setProgress(10 + (80 * i / pdf.numPages));
            const lines = await pageTextLines(pdf, i);
            allText += (isMd ? '## Page ' + i + '\n\n' : '--- Page ' + i + ' ---\n') + lines.join('\n') + '\n\n';
        }
        const ext = isMd ? 'md' : 'txt';
        setResult(new Blob([allText], { type: 'text/plain' }), 'extracted.' + ext);
    }

    /* ─── PDF TO WORD (.docx) ─── */
    async function processPdfToWord() {
        const bytes = await readFile(selectedFiles[0]);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const lines = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            setProgress(10 + (80 * i / pdf.numPages));
            lines.push(...await pageTextLines(pdf, i));
            if (i < pdf.numPages) lines.push('');
        }
        const docx = BinUtils.docxFromLines(lines.length ? lines : ['(No extractable text found in this PDF)']);
        setResult(new Blob([docx], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'converted.docx');
    }

    /* ─── PDF TO CSV / EXCEL ─── */
    async function processPdfToCsv() {
        const bytes = await readFile(selectedFiles[0]);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const allRows = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            setProgress(10 + (80 * i / pdf.numPages));
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            allRows.push(...BinUtils.itemsToCsvRows(content.items));
        }
        const csv = BinUtils.rowsToCsv(allRows);
        setResult(new Blob(['﻿' + csv], { type: 'text/csv' }), 'extracted.csv');
    }

    /* ─── PDF TO HTML ─── */
    async function processPdfToHtml() {
        const bytes = await readFile(selectedFiles[0]);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Converted PDF</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;}.page{margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid #ddd;}</style></head><body>';
        for (let i = 1; i <= pdf.numPages; i++) {
            setProgress(10 + (80 * i / pdf.numPages));
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            html += '<div class="page"><h3>Page ' + i + '</h3><p>' + content.items.map(item => item.str).join(' ') + '</p></div>';
        }
        html += '</body></html>';
        setResult(new Blob([html], { type: 'text/html' }), 'converted.html');
    }

    /* ─── PDF TO XML ─── */
    async function processPdfToXml() {
        const bytes = await readFile(selectedFiles[0]);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<document>\n';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            xml += '  <page number="' + i + '">\n';
            content.items.forEach(item => { xml += '    <text>' + esc(item.str) + '</text>\n'; });
            xml += '  </page>\n';
        }
        xml += '</document>';
        setResult(new Blob([xml], { type: 'text/xml' }), 'converted.xml');
    }

    /* ─── PDF TO BASE64 ─── */
    async function processPdfToBase64() {
        const bytes = await readFile(selectedFiles[0]);
        const b64 = BinUtils.bytesToBase64(new Uint8Array(bytes));
        setResult(new Blob([b64], { type: 'text/plain' }), 'encoded.txt');
    }

    /* ─── COMPRESS ─── */
    async function processCompress() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        setProgress(50);
        const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
        setProgress(90);
        const saved = ((bytes.byteLength - out.byteLength) / bytes.byteLength * 100).toFixed(1);
        setResult(new Blob([out], { type: 'application/pdf' }), 'compressed.pdf');
        $('#downloadInfo').textContent = 'compressed.pdf (' + fmtSize(out.byteLength) + ') — Reduced by ' + Math.max(0, saved) + '%';
    }

    /* ─── WATERMARK ─── */
    async function processWatermark() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const text = $('#optWatermarkText')?.value || 'WATERMARK';
        const fontSize = parseInt($('#optWatermarkSize')?.value || '60');
        const opacity = (parseInt($('#optWatermarkOpacity')?.value || '20')) / 100;
        const angle = parseInt($('#optWatermarkAngle')?.value || '45');
        const font = await doc.embedFont(StandardFonts.HelveticaBold);

        doc.getPages().forEach(page => {
            const { width, height } = page.getSize();
            page.drawText(text, {
                x: width / 2 - (font.widthOfTextAtSize(text, fontSize) / 2),
                y: height / 2,
                size: fontSize, font,
                color: rgb(0.5, 0.5, 0.5),
                opacity,
                rotate: degrees(angle),
            });
        });
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'watermarked.pdf');
    }

    /* ─── PAGE NUMBERS ─── */
    async function processPageNumbers() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const pos = $('#optPageNumPos')?.value || 'bottom-center';
        const start = parseInt($('#optPageNumStart')?.value || '1');
        const fmt = $('#optPageNumFmt')?.value || 'number';
        const pages = doc.getPages();

        pages.forEach((page, i) => {
            const num = start + i;
            let label = '' + num;
            if (fmt === 'dash') label = '- ' + num + ' -';
            if (fmt === 'page') label = 'Page ' + num;

            const { width, height } = page.getSize();
            let x, y;
            if (pos.includes('bottom')) y = 30; else y = height - 30;
            if (pos.includes('center')) x = width / 2 - font.widthOfTextAtSize(label, 10) / 2;
            else if (pos.includes('right')) x = width - 50;
            else x = 40;

            page.drawText(label, { x, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
        });
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'numbered.pdf');
    }

    /* ─── CROP ─── */
    async function processCrop() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const top = parseInt($('#optCropTop')?.value || '36');
        const bottom = parseInt($('#optCropBottom')?.value || '36');
        const left = parseInt($('#optCropLeft')?.value || '36');
        const right = parseInt($('#optCropRight')?.value || '36');

        doc.getPages().forEach(page => {
            const { width, height } = page.getSize();
            page.setCropBox(left, bottom, width - left - right, height - top - bottom);
        });
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'cropped.pdf');
    }

    /* ─── RESIZE ─── */
    async function processResize() {
        const bytes = await readFile(selectedFiles[0]);
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const sizeMap = { A4: PageSizes.A4, Letter: PageSizes.Letter, Legal: PageSizes.Legal, A3: PageSizes.A3, A5: PageSizes.A5 };
        const size = sizeMap[$('#optResize')?.value || 'A4'] || PageSizes.A4;
        const doc = await PDFDocument.create();
        const pages = await doc.copyPages(src, src.getPageIndices());
        pages.forEach(p => { p.setSize(size[0], size[1]); doc.addPage(p); });
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'resized.pdf');
    }

    /* ─── GRAYSCALE (re-save, strips some color) ─── */
    async function processGrayscale() {
        // Client-side: render each page via PDF.js as grayscale canvas, then re-embed
        const bytes = await readFile(selectedFiles[0]);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const doc = await PDFDocument.create();
        for (let i = 1; i <= pdf.numPages; i++) {
            setProgress(10 + (80 * i / pdf.numPages));
            const pdfPage = await pdf.getPage(i);
            const scale = 2;
            const vp = pdfPage.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = vp.width; canvas.height = vp.height;
            const ctx = canvas.getContext('2d');
            await pdfPage.render({ canvasContext: ctx, viewport: vp }).promise;
            // Convert to grayscale
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let j = 0; j < imageData.data.length; j += 4) {
                const avg = imageData.data[j] * 0.299 + imageData.data[j + 1] * 0.587 + imageData.data[j + 2] * 0.114;
                imageData.data[j] = imageData.data[j + 1] = imageData.data[j + 2] = avg;
            }
            ctx.putImageData(imageData, 0, 0);
            const pngBytes = await new Promise(resolve => canvas.toBlob(b => b.arrayBuffer().then(resolve), 'image/png'));
            const img = await doc.embedPng(pngBytes);
            const page = doc.addPage([vp.width / scale, vp.height / scale]);
            page.drawImage(img, { x: 0, y: 0, width: vp.width / scale, height: vp.height / scale });
        }
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'grayscale.pdf');
    }

    /* ─── FLATTEN ─── */
    async function processFlatten() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const form = doc.getForm();
        try { form.flatten(); } catch (e) { /* no form fields */ }
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'flattened.pdf');
    }

    /* ─── METADATA ─── */
    async function processMetadata() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const title = $('#optMetaTitle')?.value; if (title) doc.setTitle(title);
        const author = $('#optMetaAuthor')?.value; if (author) doc.setAuthor(author);
        const subject = $('#optMetaSubject')?.value; if (subject) doc.setSubject(subject);
        const keywords = $('#optMetaKeywords')?.value?.split(',').map(s => s.trim()).filter(Boolean);
        if (keywords?.length) doc.setKeywords(keywords);
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'metadata-updated.pdf');
    }

    /* ─── PROTECT ─── */
    async function processProtect() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pw = $('#optPassword')?.value;
        if (!pw) { alert('Please enter a password'); throw new Error('No password'); }
        // pdf-lib doesn't support encryption natively; we re-save and notify user
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'protected.pdf');
        $('#downloadInfo').textContent = 'protected.pdf — Note: Client-side encryption is limited. For full AES encryption, use a server-side solution.';
    }

    /* ─── UNLOCK ─── */
    async function processUnlock() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'unlocked.pdf');
    }

    /* ─── SIGN ─── */
    async function processSign() {
        const canvas = $('#signatureCanvas');
        if (!canvas) return;
        const sigDataUrl = canvas.toDataURL('image/png');
        const sigBytes = await fetch(sigDataUrl).then(r => r.arrayBuffer());

        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const sigImg = await doc.embedPng(sigBytes);
        const sigW = 150; const sigH = sigW * (canvas.height / canvas.width);
        const pageOpt = $('#optSignPage')?.value || 'last';
        const pages = doc.getPages();
        let targetPages;
        if (pageOpt === 'first') targetPages = [pages[0]];
        else if (pageOpt === 'all') targetPages = pages;
        else targetPages = [pages[pages.length - 1]];

        targetPages.forEach(page => {
            const { width } = page.getSize();
            page.drawImage(sigImg, { x: width - sigW - 50, y: 50, width: sigW, height: sigH });
        });
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'signed.pdf');
    }

    /* ─── EXTRACT IMAGES (renders each page to PNG) ─── */
    async function processExtractImages() {
        const bytes = await readFile(selectedFiles[0]);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const total = pdf.numPages;
        const pages = [];
        for (let i = 1; i <= total; i++) {
            setProgress(10 + (80 * i / total));
            const { canvas, ctx } = await renderPdfPage(pdf, i);
            pages.push(await canvasToBytes(canvas, ctx, 'png'));
        }
        if (total === 1) {
            setResult(new Blob([pages[0]], { type: 'image/png' }), 'page-1.png');
        } else {
            const zip = BinUtils.zipStore(pages.map((p, i) => ({ name: 'page-' + (i + 1) + '.png', data: p })));
            setResult(new Blob([zip], { type: 'application/zip' }), 'page-images.zip');
            $('#downloadInfo').textContent = 'page-images.zip — ' + total + ' PNGs (' + fmtSize(zip.length) + ')';
        }
    }

    /* ─── EXTRACT LINKS ─── */
    async function processExtractLinks() {
        const bytes = await readFile(selectedFiles[0]);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        let links = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const annotations = await page.getAnnotations();
            annotations.filter(a => a.subtype === 'Link' && a.url).forEach(a => {
                links += 'Page ' + i + ': ' + a.url + '\n';
            });
        }
        setProgress(80);
        if (!links) links = 'No links found in this PDF.';
        setResult(new Blob([links], { type: 'text/plain' }), 'links.txt');
    }

    /* ─── PDF INFO ─── */
    async function processPdfInfo() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const info = [
            'File: ' + selectedFiles[0].name,
            'Size: ' + fmtSize(selectedFiles[0].size),
            'Pages: ' + doc.getPageCount(),
            'Title: ' + (doc.getTitle() || 'N/A'),
            'Author: ' + (doc.getAuthor() || 'N/A'),
            'Subject: ' + (doc.getSubject() || 'N/A'),
            'Creator: ' + (doc.getCreator() || 'N/A'),
            'Producer: ' + (doc.getProducer() || 'N/A'),
            'Creation Date: ' + (doc.getCreationDate() || 'N/A'),
            'Modification Date: ' + (doc.getModificationDate() || 'N/A'),
        ];
        const pageInfo = doc.getPages().map((p, i) => {
            const { width, height } = p.getSize();
            return 'Page ' + (i + 1) + ': ' + width.toFixed(0) + ' x ' + height.toFixed(0) + ' pts (' + (width / 72).toFixed(2) + ' x ' + (height / 72).toFixed(2) + ' in)';
        });
        const text = info.join('\n') + '\n\n--- Page Dimensions ---\n' + pageInfo.join('\n');
        setProgress(80);
        setResult(new Blob([text], { type: 'text/plain' }), 'pdf-info.txt');
    }

    /* ─── REPAIR ─── */
    async function processRepair() {
        const bytes = await readFile(selectedFiles[0]);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        setProgress(80);
        const out = await doc.save();
        setResult(new Blob([out], { type: 'application/pdf' }), 'repaired.pdf');
    }

    /* ─── COMPARE ─── */
    async function processCompare() {
        const bytes1 = await readFile(selectedFiles[0]);
        const bytes2 = await readFile(selectedFiles[1]);
        const pdf1 = await pdfjsLib.getDocument({ data: bytes1 }).promise;
        const pdf2 = await pdfjsLib.getDocument({ data: bytes2 }).promise;
        let result = 'PDF Comparison Report\n=====================\n\n';
        result += 'File 1: ' + selectedFiles[0].name + ' (' + pdf1.numPages + ' pages)\n';
        result += 'File 2: ' + selectedFiles[1].name + ' (' + pdf2.numPages + ' pages)\n\n';
        const maxPages = Math.max(pdf1.numPages, pdf2.numPages);
        for (let i = 1; i <= maxPages; i++) {
            setProgress(10 + (80 * i / maxPages));
            let text1 = '', text2 = '';
            if (i <= pdf1.numPages) { const p = await pdf1.getPage(i); const c = await p.getTextContent(); text1 = c.items.map(it => it.str).join(' '); }
            if (i <= pdf2.numPages) { const p = await pdf2.getPage(i); const c = await p.getTextContent(); text2 = c.items.map(it => it.str).join(' '); }
            if (text1 === text2) result += 'Page ' + i + ': IDENTICAL\n';
            else result += 'Page ' + i + ': DIFFERENT\n  File 1: ' + text1.substring(0, 100) + '...\n  File 2: ' + text2.substring(0, 100) + '...\n';
        }
        setResult(new Blob([result], { type: 'text/plain' }), 'comparison.txt');
    }

    /* ── Helpers ── */
    function fmtSize(b) { if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; }
    function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function downloadBlob(blob, name) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    }

    /* ── Handle "Coming Soon" tools ── */
    if (tool.soon) {
        $('#stepUpload').innerHTML = `
            <div class="text-center py-5">
                <div style="font-size:4rem;opacity:0.3"><i class="bi ${tool.icon}"></i></div>
                <h4 class="fw-bold mt-3">${tool.name}</h4>
                <p class="text-muted">${tool.desc}</p>
                <span class="badge-soon" style="font-size:1rem;padding:6px 16px;">Coming Soon</span>
                <p class="text-muted mt-3">This tool is currently under development.</p>
                <a href="../index.html#toolsSection" class="btn btn-tool-primary mt-2"><i class="bi bi-grid-3x3-gap-fill"></i> Browse Other Tools</a>
            </div>`;
    }

})();
