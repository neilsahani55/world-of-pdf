/* ============================================
   PDF Merge Toolkit - Tool Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const toolUpload = document.getElementById('toolUpload');
    const toolUploadBtn = document.getElementById('toolUploadBtn');
    const toolFileInput = document.getElementById('toolFileInput');
    const fileList = document.getElementById('fileList');
    const fileItems = document.getElementById('fileItems');
    const mergeBtn = document.getElementById('mergeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const processing = document.getElementById('processing');

    let selectedFiles = [];

    // Upload click
    toolUploadBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toolFileInput?.click();
    });

    toolUpload?.addEventListener('click', () => {
        toolFileInput?.click();
    });

    // Drag & Drop
    toolUpload?.addEventListener('dragover', (e) => {
        e.preventDefault();
        toolUpload.classList.add('drag-over');
    });

    toolUpload?.addEventListener('dragleave', () => {
        toolUpload.classList.remove('drag-over');
    });

    toolUpload?.addEventListener('drop', (e) => {
        e.preventDefault();
        toolUpload.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
        if (files.length) {
            addFiles(files);
        }
    });

    toolFileInput?.addEventListener('change', () => {
        if (toolFileInput.files.length) {
            addFiles(Array.from(toolFileInput.files));
            toolFileInput.value = '';
        }
    });

    function addFiles(files) {
        selectedFiles = [...selectedFiles, ...files];
        renderFileList();
    }

    function renderFileList() {
        if (selectedFiles.length === 0) {
            fileList.style.display = 'none';
            toolUpload.style.display = '';
            return;
        }

        toolUpload.style.display = 'none';
        fileList.style.display = '';

        fileItems.innerHTML = selectedFiles.map((file, index) => `
            <div class="file-item" data-index="${index}" draggable="true">
                <span class="file-item-drag">⠿</span>
                <span class="file-item-icon">📄</span>
                <div class="file-item-info">
                    <div class="file-item-name">${escapeHtml(file.name)}</div>
                    <div class="file-item-size">${formatSize(file.size)}</div>
                </div>
                <button class="file-item-remove" data-index="${index}" title="Remove">&times;</button>
            </div>
        `).join('');

        // Bind remove buttons
        fileItems.querySelectorAll('.file-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index);
                selectedFiles.splice(idx, 1);
                renderFileList();
            });
        });

        // Drag to reorder
        initDragReorder();
    }

    function initDragReorder() {
        const items = fileItems.querySelectorAll('.file-item');
        let draggedIdx = null;

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedIdx = parseInt(item.dataset.index);
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                draggedIdx = null;
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const dropIdx = parseInt(item.dataset.index);
                if (draggedIdx !== null && draggedIdx !== dropIdx) {
                    const movedFile = selectedFiles.splice(draggedIdx, 1)[0];
                    selectedFiles.splice(dropIdx, 0, movedFile);
                    renderFileList();
                }
            });
        });
    }

    // Clear all files
    clearBtn?.addEventListener('click', () => {
        selectedFiles = [];
        renderFileList();
    });

    // Merge button - simulate processing
    mergeBtn?.addEventListener('click', () => {
        if (selectedFiles.length < 2) {
            alert('Please select at least 2 PDF files to merge.');
            return;
        }

        fileList.style.display = 'none';
        processing.style.display = '';

        // Simulate processing
        setTimeout(() => {
            processing.style.display = 'none';
            showDownload();
        }, 2500);
    });

    function showDownload() {
        const workspace = document.querySelector('.workspace-card');
        workspace.innerHTML = `
            <div class="download-section">
                <div class="download-icon">✅</div>
                <h3>Your PDF is ready!</h3>
                <p>${selectedFiles.length} files merged successfully</p>
                <button class="btn btn-download" onclick="alert('In a production environment, your merged PDF would download here.')">
                    ⬇️ Download Merged PDF
                </button>
                <p style="margin-top:16px;font-size:12px;color:var(--text-muted)">File will be auto-deleted in 30 seconds</p>
            </div>
        `;
    }

    // Helpers
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
