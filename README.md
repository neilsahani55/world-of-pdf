# PDF Merge Toolkit

A comprehensive, free, browser-based PDF manipulation platform with **48+ tools**. No sign-up required. 100% client-side processing — your files never leave your device.

![PDF Merge Toolkit](https://img.shields.io/badge/Tools-48%2B-6366f1?style=for-the-badge)
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
- **Search & Filter** — Find any tool instantly with search and category tabs

## Tools Available

### Merge & Organize (6)
Merge PDF, Split PDF, Organize PDF, Rotate PDF, Remove Pages, Extract Pages

### Convert to PDF (8)
Image to PDF, HTML to PDF, Word to PDF, Excel to PDF, PowerPoint to PDF, Text to PDF, Markdown to PDF, Base64 to PDF

### PDF to Image (4)
PDF to PNG, PDF to JPG, PDF to TIFF, PDF to BMP

### PDF to Document (9)
PDF to Word, PDF to Excel, PDF to PowerPoint, PDF to Text, PDF to HTML, PDF to Markdown, PDF to XML, PDF to CSV, PDF to Base64

### Edit & Enhance (10)
Compress PDF, Watermark, Page Numbers, Edit PDF*, Crop PDF, Resize PDF, Grayscale, Flatten PDF, Metadata, PDF/A

### Security (4)
Protect PDF, Unlock PDF, Redact PDF*, Sign PDF

### Extract & Utility (6)
Extract Images, Extract Links, PDF Info, Repair PDF, Compare PDF, OCR PDF*

> *\* = Coming Soon*

## Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5 / CSS3 / JS** | Frontend |
| **Bootstrap 5** | Layout & responsive grid |
| **Bootstrap Icons** | Icon system |
| **pdf-lib** | Client-side PDF manipulation |
| **PDF.js** | PDF rendering & text extraction |
| **Google Fonts (Inter)** | Typography |

## Project Structure

```
pdf-merge-toolkit/
├── index.html              # Homepage with all tools grid
├── favicon.svg             # Site favicon
├── css/
│   ├── bootstrap.min.css   # Bootstrap 5
│   ├── bootstrap-icons.css # Bootstrap Icons
│   ├── style.css           # Custom styles + 10 themes
│   └── tool-page.css       # Tool page styles
│   └── fonts/              # Bootstrap Icons font files
├── js/
│   ├── bootstrap.bundle.min.js  # Bootstrap JS
│   ├── app.js                   # Homepage logic (tabs, search, mega-menu, themes)
│   └── pdf-tools-engine.js      # PDF processing engine for all 48+ tools
└── tools/
    ├── tool-template.html       # Base template for tool pages
    ├── merge-pdf.html           # Individual tool pages (48 total)
    ├── split-pdf.html
    ├── compress-pdf.html
    └── ... (48 tool pages)
```

## Getting Started

### Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/pdf-merge-toolkit.git

# Navigate to the project
cd pdf-merge-toolkit

# Serve with any static server
npx serve .

# Open in browser
# http://localhost:3000
```

### Deploy to Netlify

1. Push the repository to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click **"Add new site"** > **"Import an existing project"**
4. Connect your GitHub repo
5. Build settings:
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.`
6. Click **Deploy**

No build step needed — it's a static site.

## How It Works

1. **Upload** — Select or drag & drop your PDF/document (up to 50 MB)
2. **Configure** — Set tool-specific options (rotation angle, watermark text, page ranges, etc.)
3. **Process** — Files are processed entirely in your browser using pdf-lib
4. **Download** — Download the result instantly. No files are stored anywhere.

## Theme System

The site includes 10 fully-designed color themes, all using CSS custom properties for seamless switching:

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
- Firefox 90+
- Safari 15+
- Edge 90+

## Developer

**Usama Gani**

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
