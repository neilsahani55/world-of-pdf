# World of PDF

A comprehensive, free, browser-based PDF platform with **48+ tools**. No sign-up required. 100% client-side processing — your files never leave your device.

**Live site:** [world-of-pdf.vercel.app](https://world-of-pdf.vercel.app) (hosted on Vercel)

![World of PDF](https://img.shields.io/badge/Tools-48%2B-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)

## Features

- **48+ PDF Tools** — Merge, split, compress, convert, rotate, watermark, sign, and more
- **100% Client-Side** — All processing happens in your browser using pdf-lib and PDF.js
- **Zero Server Uploads** — Your files never leave your device
- **No Sign-up Required** — Just open and use, no account needed
- **No Watermarks** — Clean output on every tool
- **10 Color Themes** — Light, Dark, Ocean Blue, Forest Green, Sunset, Rose, Midnight, Lavender, Charcoal, Emerald
- **Fully Responsive** — Works on desktop, tablet, and mobile
- **Tool-to-Tool Navigation** — Full category menus on every page, plus search & filter on the homepage

## How Each Tool Works

### Merge & Organize
| Tool | How it works |
|---|---|
| **Merge PDF** | Copies every page from your selected PDFs (drag to reorder) into one new document with pdf-lib |
| **Split PDF** | Saves each page as its own PDF and bundles them into a ZIP, or extracts a custom page range into one PDF |
| **Organize PDF** | Rebuilds the document with pages reversed, odd/even only, or in any custom order you type |
| **Rotate PDF** | Adds 90°/180°/270° to the rotation of all pages or just the pages you pick |
| **Remove Pages** | Copies every page *except* the ones you list into a new PDF |
| **Extract Pages** | Copies only the pages you list into a new PDF |

### Convert to PDF
| Tool | How it works |
|---|---|
| **Image to PDF** | Embeds JPG/PNG directly; GIF/BMP/WebP are decoded through a canvas first — one page per image |
| **Word to PDF** | Unzips the .docx in the browser, decompresses `document.xml`, extracts the text runs, and typesets them onto A4 pages (also accepts .txt/.rtf) |
| **PowerPoint to PDF** | Unzips the .pptx and extracts the text of each slide into a paginated PDF |
| **Excel to PDF** | Renders CSV/TSV text content onto A4 pages with word-wrapping |
| **Text to PDF** | Typesets plain text with automatic word-wrap and page breaks |
| **HTML to PDF** | Strips tags/scripts/styles from the HTML and converts the readable text to PDF |
| **Markdown to PDF** | Converts the Markdown source text to a paginated PDF |
| **Base64 to PDF** | Decodes a pasted (or uploaded) Base64 string back into a binary PDF, with a header sanity-check |

### Convert from PDF
| Tool | How it works |
|---|---|
| **PDF to PNG / JPG** | Renders every page to a canvas at 2× scale via PDF.js; single page downloads directly, multiple pages come as a ZIP |
| **PDF to TIFF** | Renders pages to canvas, then writes real uncompressed RGB TIFF files byte-by-byte |
| **PDF to BMP** | Renders pages to canvas, then writes real 24-bit BMP files byte-by-byte |
| **PDF to Word** | Extracts text lines (grouped by position) and packages them into a genuine .docx (OOXML) file |
| **PDF to Excel / CSV** | Uses each text fragment's x/y coordinates to reconstruct rows and columns, then writes proper CSV |
| **PDF to Text** | Extracts all text via PDF.js, grouped into visual lines, one section per page |
| **PDF to HTML** | Wraps the extracted text of each page in a styled standalone HTML document |
| **PDF to Markdown** | Extracts text with `## Page N` headings per page |
| **PDF to XML** | Emits an XML tree with one `<page>` element per page and `<text>` nodes per fragment |
| **PDF to PowerPoint** | Extracts each page's text into a per-page text outline |
| **PDF to Base64** | Encodes the PDF bytes to a Base64 string (chunked, so large files work) |

### Edit & Enhance
| Tool | How it works |
|---|---|
| **Compress PDF** | Re-saves the document with pdf-lib object streams enabled (lossless; savings vary by file) |
| **Watermark** | Draws your text on every page with custom size, opacity, and angle |
| **Page Numbers** | Stamps configurable page numbers (position, start number, format) on each page |
| **Crop PDF** | Sets each page's crop box inward by the margins you specify |
| **Resize PDF** | Copies pages and sets their media box to A3/A4/A5/Letter/Legal |
| **Grayscale** | Renders each page to canvas, converts pixels to luminance grayscale, re-embeds as image pages |
| **Flatten PDF** | Bakes interactive form fields into the static page content |
| **Metadata** | Rewrites title, author, subject, and keywords |
| **PDF/A** | Flattens forms and re-saves for archival use |
| **Edit PDF** | *Coming soon* |

### Security
| Tool | How it works |
|---|---|
| **Protect PDF** | Re-saves the PDF; note that true AES encryption isn't possible client-side with pdf-lib — the page says so honestly |
| **Unlock PDF** | Loads with `ignoreEncryption` and re-saves without the password (for PDFs you own) |
| **Sign PDF** | Lets you draw a signature on canvas (mouse or touch) and stamps it on the first/last/all pages |
| **Redact PDF** | *Coming soon* |

### Extract & Utility
| Tool | How it works |
|---|---|
| **Extract Images** | Renders every page as a PNG and delivers them in a ZIP |
| **Extract Links** | Walks each page's link annotations and lists every URL with its page number |
| **PDF Info** | Reads page count, metadata, dates, and per-page dimensions |
| **Repair PDF** | Re-parses and re-serializes the file, which fixes many structural issues |
| **Compare PDF** | Extracts text of both files page-by-page and reports identical/different per page |
| **OCR PDF** | *Coming soon* |

## Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5 / CSS3 / JS** | Frontend — no framework, no build step |
| **Bootstrap 5** | Layout & responsive grid |
| **Bootstrap Icons** | Icon system |
| **pdf-lib** | Client-side PDF creation & manipulation |
| **PDF.js** | PDF rendering & text extraction |
| **binary-utils.js** | In-house zero-dependency ZIP/BMP/TIFF/DOCX/CSV encoders (Node-testable) |
| **Google Fonts (Inter)** | Typography |

## Project Structure

```
world-of-pdf/
├── index.html              # Homepage with all-tools grid, search, category tabs
├── about.html              # About page
├── contact.html            # Contact page
├── privacy.html            # Privacy policy
├── terms.html              # Terms of use
├── favicon.svg             # Site favicon
├── LICENSE                 # MIT license
├── css/
│   ├── bootstrap.min.css   # Bootstrap 5
│   ├── bootstrap-icons.css # Bootstrap Icons
│   ├── fonts/              # Icon font files
│   ├── style.css           # Custom styles + 10 themes
│   └── tool-page.css       # Tool page styles
├── js/
│   ├── bootstrap.bundle.min.js  # Bootstrap JS
│   ├── app.js                   # Homepage logic (grid, tabs, search, menus, themes)
│   ├── binary-utils.js          # ZIP / BMP / TIFF / DOCX / CSV binary helpers
│   └── pdf-tools-engine.js      # Shared engine driving all 48 tool pages
└── tools/
    ├── tool-template.html       # Base template (all tool pages are generated from it)
    ├── merge-pdf.html           # 48 individual tool pages
    └── ...
```

Every tool page is identical to `tool-template.html` except its `<title>`/meta description. The engine reads the page's URL slug, looks it up in its `TOOLS` map, and wires up the upload flow, options panel, and processor for that tool.

## Getting Started

### Run Locally

```bash
# Clone the repository
git clone https://github.com/neilsahani55/world-of-pdf.git

# Navigate to the project
cd world-of-pdf

# Serve with any static server
npx serve .

# Open in browser
# http://localhost:3000
```

No build step needed — it's a static site.

### Deploy to Vercel

The live site runs on Vercel. To deploy your own:

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**
3. Import the GitHub repo
4. Framework preset: **Other** — leave build command and output directory empty
5. Click **Deploy**

## How It Works

1. **Upload** — Select or drag & drop your file (up to 50 MB)
2. **Configure** — Set tool-specific options (rotation angle, watermark text, page ranges, etc.)
3. **Process** — Files are processed entirely in your browser using pdf-lib / PDF.js
4. **Download** — Download the result instantly. Nothing is stored anywhere.

## Theme System

Ten fully-designed color themes driven by CSS custom properties, persisted in localStorage:

| Theme | Primary Color |
|---|---|
| Light | `#6366f1` (Indigo) |
| Dark | `#818cf8` |
| Ocean Blue | `#2563eb` |
| Forest Green | `#16a34a` |
| Sunset | `#ea580c` |
| Rose | `#e11d48` |
| Midnight | `#38bdf8` |
| Lavender | `#9333ea` |
| Charcoal | `#a78bfa` |
| Emerald | `#10b981` |

## Browser Support

- Chrome 90+
- Firefox 113+
- Safari 16.4+
- Edge 90+

(Firefox/Safari minimums are set by the `DecompressionStream` API used for reading .docx/.pptx files; every other tool works on older versions too.)

## Developer

**Neel Sahani**

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
