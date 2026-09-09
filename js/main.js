/* ============================================
   PDF Merge Toolkit - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== Theme Switcher ==========
    const themeToggle = document.getElementById('themeToggle');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Load saved theme
    const savedTheme = localStorage.getItem('pdfmt-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateActiveTheme(savedTheme);

    themeToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('show');
    });

    themeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('pdfmt-theme', theme);
            updateActiveTheme(theme);
            themeDropdown.classList.remove('show');
        });
    });

    function updateActiveTheme(theme) {
        themeOptions.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    // Close theme dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-switcher')) {
            themeDropdown?.classList.remove('show');
        }
    });

    // ========== Mobile Menu ==========
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');

    function openMobile() {
        mobileDrawer?.classList.add('show');
        mobileOverlay?.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMobile() {
        mobileDrawer?.classList.remove('show');
        mobileOverlay?.classList.remove('show');
        document.body.style.overflow = '';
    }

    mobileToggle?.addEventListener('click', openMobile);
    mobileClose?.addEventListener('click', closeMobile);
    mobileOverlay?.addEventListener('click', closeMobile);

    // Mobile Accordion
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const panel = trigger.nextElementSibling;
            const isOpen = panel.classList.contains('show');

            // Close all panels
            document.querySelectorAll('.accordion-panel').forEach(p => p.classList.remove('show'));
            document.querySelectorAll('.accordion-trigger').forEach(t => t.classList.remove('active'));

            if (!isOpen) {
                panel.classList.add('show');
                trigger.classList.add('active');
            }
        });
    });

    // ========== Mega Menu (Desktop) ==========
    const megaItems = document.querySelectorAll('.nav-item.has-mega');

    megaItems.forEach(item => {
        let timeout;

        item.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            // Close other mega dropdowns
            megaItems.forEach(other => {
                if (other !== item) {
                    other.querySelector('.mega-dropdown')?.classList.remove('show');
                }
            });
            item.querySelector('.mega-dropdown')?.classList.add('show');
        });

        item.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                item.querySelector('.mega-dropdown')?.classList.remove('show');
            }, 200);
        });
    });

    // ========== File Upload ==========
    const uploadArea = document.getElementById('uploadArea');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');

    uploadBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput?.click();
    });

    uploadArea?.addEventListener('click', () => {
        fileInput?.click();
    });

    // Drag & Drop
    uploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea?.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    });

    fileInput?.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFiles(fileInput.files);
        }
    });

    function handleFiles(files) {
        const fileList = Array.from(files);
        const names = fileList.map(f => f.name).join(', ');

        // Show selected files feedback
        const uploadIcon = uploadArea.querySelector('.upload-icon');
        const uploadH3 = uploadArea.querySelector('h3');
        const uploadP = uploadArea.querySelector('p');

        if (uploadIcon) uploadIcon.textContent = '✅';
        if (uploadH3) uploadH3.textContent = `${fileList.length} file${fileList.length > 1 ? 's' : ''} selected`;
        if (uploadP) uploadP.textContent = names;

        // Reset after 3 seconds
        setTimeout(() => {
            if (uploadIcon) uploadIcon.textContent = '📁';
            if (uploadH3) uploadH3.textContent = 'Select or drag & drop your PDF';
            if (uploadP) uploadP.textContent = 'Up to 50 MB per file';
        }, 3000);
    }

    // ========== Smooth scroll for anchor links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== Header scroll effect ==========
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 10) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ========== Intersection Observer for animations ==========
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe tool categories and step cards
    document.querySelectorAll('.tool-category, .step-card, .trust-card').forEach(el => {
        observer.observe(el);
    });
});
