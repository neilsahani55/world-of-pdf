/* ===========================================================
   PDF Merge Toolkit — App JavaScript
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Tool Data (48+ tools) ── */
    const tools = [
        // Merge & Organize
        { name: 'Merge PDF', desc: 'Combine multiple PDFs into a single document', cat: 'Merge & Organize', icon: 'bi-layers-fill', color: 'indigo', href: 'tools/merge-pdf.html' },
        { name: 'Split PDF', desc: 'Separate pages into individual PDFs', cat: 'Merge & Organize', icon: 'bi-scissors', color: 'indigo', href: 'tools/split-pdf.html' },
        { name: 'Organize PDF', desc: 'Reorder, remove, or reverse pages', cat: 'Merge & Organize', icon: 'bi-arrow-down-up', color: 'indigo', href: 'tools/organize-pdf.html' },
        { name: 'Rotate PDF', desc: 'Rotate pages 90\u00b0, 180\u00b0, or 270\u00b0', cat: 'Merge & Organize', icon: 'bi-arrow-repeat', color: 'indigo', href: 'tools/rotate-pdf.html' },
        { name: 'Remove Pages', desc: 'Delete specific pages from PDF', cat: 'Merge & Organize', icon: 'bi-trash3', color: 'indigo', href: 'tools/remove-pages.html' },
        { name: 'Extract Pages', desc: 'Pull pages into a new PDF', cat: 'Merge & Organize', icon: 'bi-file-earmark-minus', color: 'indigo', href: 'tools/extract-pages.html' },

        // Convert to PDF
        { name: 'Image to PDF', desc: 'Convert images to a single PDF', cat: 'Convert to PDF', icon: 'bi-image', color: 'blue', href: 'tools/image-to-pdf.html' },
        { name: 'HTML to PDF', desc: 'Convert HTML files to PDF', cat: 'Convert to PDF', icon: 'bi-filetype-html', color: 'blue', href: 'tools/html-to-pdf.html' },
        { name: 'Word to PDF', desc: 'Convert DOCX documents to PDF', cat: 'Convert to PDF', icon: 'bi-file-earmark-word', color: 'blue', href: 'tools/word-to-pdf.html' },
        { name: 'Excel to PDF', desc: 'Convert XLSX spreadsheets to PDF', cat: 'Convert to PDF', icon: 'bi-file-earmark-excel', color: 'green', href: 'tools/excel-to-pdf.html' },
        { name: 'PowerPoint to PDF', desc: 'Convert PPTX slides to PDF', cat: 'Convert to PDF', icon: 'bi-file-earmark-ppt', color: 'orange', href: 'tools/powerpoint-to-pdf.html' },
        { name: 'Text to PDF', desc: 'Convert plain text files to PDF', cat: 'Convert to PDF', icon: 'bi-file-text', color: 'gray', href: 'tools/text-to-pdf.html' },
        { name: 'Markdown to PDF', desc: 'Convert Markdown to styled PDF', cat: 'Convert to PDF', icon: 'bi-markdown', color: 'purple', href: 'tools/markdown-to-pdf.html' },
        { name: 'Base64 to PDF', desc: 'Decode Base64 string to PDF', cat: 'Convert to PDF', icon: 'bi-code-slash', color: 'cyan', href: 'tools/base64-to-pdf.html' },

        // Convert from PDF — Image
        { name: 'PDF to PNG', desc: 'High-quality PNG export', cat: 'Convert from PDF', icon: 'bi-filetype-png', color: 'green', href: 'tools/pdf-to-png.html' },
        { name: 'PDF to JPG', desc: 'Convert PDF pages to JPG', cat: 'Convert from PDF', icon: 'bi-filetype-jpg', color: 'amber', href: 'tools/pdf-to-jpg.html' },
        { name: 'PDF to TIFF', desc: 'Convert to TIFF format', cat: 'Convert from PDF', icon: 'bi-filetype-tiff', color: 'purple', href: 'tools/pdf-to-tiff.html' },
        { name: 'PDF to BMP', desc: 'Convert to BMP format', cat: 'Convert from PDF', icon: 'bi-filetype-bmp', color: 'cyan', href: 'tools/pdf-to-bmp.html' },

        // Convert from PDF — Document
        { name: 'PDF to Word', desc: 'Convert PDF to editable DOCX', cat: 'Convert from PDF', icon: 'bi-file-earmark-word', color: 'blue', href: 'tools/pdf-to-word.html' },
        { name: 'PDF to Excel', desc: 'Extract data into XLSX spreadsheet', cat: 'Convert from PDF', icon: 'bi-file-earmark-excel', color: 'green', href: 'tools/pdf-to-excel.html' },
        { name: 'PDF to PowerPoint', desc: 'Convert pages to PPTX slides', cat: 'Convert from PDF', icon: 'bi-file-earmark-ppt', color: 'orange', href: 'tools/pdf-to-powerpoint.html' },
        { name: 'PDF to Text', desc: 'Extract all text from PDF', cat: 'Convert from PDF', icon: 'bi-file-text', color: 'gray', href: 'tools/pdf-to-text.html' },
        { name: 'PDF to HTML', desc: 'Convert PDF to web page', cat: 'Convert from PDF', icon: 'bi-filetype-html', color: 'amber', href: 'tools/pdf-to-html.html' },
        { name: 'PDF to Markdown', desc: 'Export as Markdown', cat: 'Convert from PDF', icon: 'bi-markdown', color: 'purple', href: 'tools/pdf-to-markdown.html' },
        { name: 'PDF to XML', desc: 'Structured XML export', cat: 'Convert from PDF', icon: 'bi-filetype-xml', color: 'teal', href: 'tools/pdf-to-xml.html' },
        { name: 'PDF to CSV', desc: 'Extract tables to CSV', cat: 'Convert from PDF', icon: 'bi-filetype-csv', color: 'green', href: 'tools/pdf-to-csv.html' },
        { name: 'PDF to Base64', desc: 'Encode PDF as Base64', cat: 'Convert from PDF', icon: 'bi-code-slash', color: 'cyan', href: 'tools/pdf-to-base64.html' },

        // Edit & Enhance
        { name: 'Compress PDF', desc: 'Reduce file size while keeping quality', cat: 'Edit & Enhance', icon: 'bi-file-zip', color: 'indigo', href: 'tools/compress-pdf.html' },
        { name: 'Watermark', desc: 'Stamp text on every page of your PDF', cat: 'Edit & Enhance', icon: 'bi-droplet-fill', color: 'blue', href: 'tools/watermark-pdf.html' },
        { name: 'Page Numbers', desc: 'Number PDF pages with custom positioning', cat: 'Edit & Enhance', icon: 'bi-hash', color: 'amber', href: 'tools/page-numbers.html' },
        { name: 'Edit PDF', desc: 'Add text and images to your PDF', cat: 'Edit & Enhance', icon: 'bi-pencil', color: 'purple', href: 'tools/edit-pdf.html', soon: true },
        { name: 'Crop PDF', desc: 'Trim margins from all or specific pages', cat: 'Edit & Enhance', icon: 'bi-crop', color: 'green', href: 'tools/crop-pdf.html' },
        { name: 'Resize PDF', desc: 'Change page dimensions to A4, Letter, or custom', cat: 'Edit & Enhance', icon: 'bi-aspect-ratio', color: 'cyan', href: 'tools/resize-pdf.html' },
        { name: 'Grayscale', desc: 'Turn color PDF into black & white', cat: 'Edit & Enhance', icon: 'bi-circle-half', color: 'gray', href: 'tools/grayscale-pdf.html' },
        { name: 'Flatten PDF', desc: 'Bake form fields and annotations into page', cat: 'Edit & Enhance', icon: 'bi-layers', color: 'orange', href: 'tools/flatten-pdf.html' },
        { name: 'Metadata', desc: 'Change title, author, subject, and keywords', cat: 'Edit & Enhance', icon: 'bi-tag', color: 'teal', href: 'tools/metadata-pdf.html' },
        { name: 'PDF/A', desc: 'Convert to ISO-standardized archival format', cat: 'Edit & Enhance', icon: 'bi-archive', color: 'rose', href: 'tools/pdfa-convert.html' },

        // Security
        { name: 'Protect PDF', desc: 'Add password encryption and set permissions', cat: 'Security', icon: 'bi-lock-fill', color: 'indigo', href: 'tools/protect-pdf.html' },
        { name: 'Unlock PDF', desc: 'Remove password protection', cat: 'Security', icon: 'bi-unlock-fill', color: 'green', href: 'tools/unlock-pdf.html' },
        { name: 'Redact PDF', desc: 'Permanently black out sensitive info', cat: 'Security', icon: 'bi-eraser-fill', color: 'rose', href: 'tools/redact-pdf.html', soon: true },
        { name: 'Sign PDF', desc: 'Add your signature to any PDF document', cat: 'Security', icon: 'bi-pen-fill', color: 'blue', href: 'tools/sign-pdf.html' },

        // Extract
        { name: 'Extract Images', desc: 'Pull all embedded images from PDF', cat: 'Extract', icon: 'bi-images', color: 'amber', href: 'tools/extract-images.html' },
        { name: 'Extract Links', desc: 'Find all URLs in your PDF', cat: 'Extract', icon: 'bi-link-45deg', color: 'blue', href: 'tools/extract-links.html' },

        // Utility
        { name: 'PDF Info', desc: 'View page count, metadata & details', cat: 'Utility', icon: 'bi-info-circle', color: 'indigo', href: 'tools/pdf-info.html' },
        { name: 'Repair PDF', desc: 'Fix corrupted or damaged PDF files', cat: 'Utility', icon: 'bi-wrench', color: 'orange', href: 'tools/repair-pdf.html' },
        { name: 'Compare PDF', desc: 'Find text differences between two PDFs', cat: 'Utility', icon: 'bi-file-diff', color: 'purple', href: 'tools/compare-pdf.html' },
        { name: 'OCR PDF', desc: 'Extract text from scanned documents', cat: 'Utility', icon: 'bi-eye', color: 'teal', href: 'tools/ocr-pdf.html', soon: true },
    ];

    /* ── Render Tool Cards ── */
    const toolGrid = document.getElementById('toolGrid');
    if (toolGrid) {
        toolGrid.innerHTML = tools.map(t => `
            <div class="col-6 col-md-4 col-lg-3 col-xl-2 tool-card-col" data-name="${t.name.toLowerCase()}" data-desc="${t.desc.toLowerCase()}" data-category="${t.cat}">
                <a href="${t.href}" class="tool-box${t.soon ? ' tool-box--soon' : ''}">
                    <div class="tool-box-icon tool-icon--${t.color}">
                        <i class="bi ${t.icon}"></i>
                    </div>
                    <div class="tool-box-title">${t.name}${t.soon ? ' <span class="badge-soon">Soon</span>' : ''}</div>
                    <div class="tool-box-desc">${t.desc}</div>
                </a>
            </div>
        `).join('');
    }

    /* ── Filter Tabs ── */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const noResults = document.getElementById('noResults');
    const searchInput = document.getElementById('toolSearch');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;
            filterCards(filter, '');
            if (searchInput) searchInput.value = '';
        });
    });

    /* ── Search ── */
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            // Reset tabs to All when searching
            filterTabs.forEach(t => t.classList.remove('active'));
            filterTabs[0]?.classList.add('active');
            filterCards('all', query);
        });
    }

    function filterCards(category, search) {
        const cards = document.querySelectorAll('.tool-card-col');
        let visible = 0;
        cards.forEach(card => {
            const matchCat = category === 'all' || card.dataset.category === category;
            const matchSearch = !search || card.dataset.name.includes(search) || card.dataset.desc.includes(search);
            const show = matchCat && matchSearch;
            card.classList.toggle('hidden', !show);
            if (show) visible++;
        });
        if (noResults) {
            noResults.classList.toggle('d-none', visible > 0);
        }
    }

    /* ── Nav Dropdowns (hover with delay) ── */
    document.querySelectorAll('.nav-dropdown').forEach(dd => {
        let timeout;
        dd.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            // Close others
            document.querySelectorAll('.nav-dropdown').forEach(o => {
                if (o !== dd) o.classList.remove('open');
            });
            dd.classList.add('open');
        });
        dd.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => dd.classList.remove('open'), 150);
        });
    });

    /* ── Theme Switcher ── */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeMenu = document.getElementById('themeMenu');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('pdf-theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu?.classList.toggle('show');
        });
    }

    themeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('pdf-theme', theme);
            themeMenu?.classList.remove('show');
        });
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeOptions.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-dropdown')) {
            themeMenu?.classList.remove('show');
        }
    });

    /* ── Mobile Menu ── */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const mobileClose = document.getElementById('mobileMenuClose');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileOverlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeMobileMenu() {
        mobileOverlay?.classList.remove('open');
        document.body.style.overflow = '';
    }

    mobileClose?.addEventListener('click', closeMobileMenu);
    mobileOverlay?.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) closeMobileMenu();
    });

    // Mobile accordion
    document.querySelectorAll('.mobile-cat-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const cat = trigger.closest('.mobile-cat');
            const wasOpen = cat.classList.contains('open');
            document.querySelectorAll('.mobile-cat').forEach(c => c.classList.remove('open'));
            if (!wasOpen) cat.classList.add('open');
        });
    });

    /* ── Smooth scroll for CTA ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

});
