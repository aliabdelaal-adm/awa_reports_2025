/**
 * Admin Dashboard Client-Side JavaScript
 * Connects to backend API for real file operations
 */

// Configuration
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : '/api';

const ADMIN_PASSWORD = '1940';

// Global variables
let currentFile = null;
let editor = null;
let allFiles = [];
let allImages = [];

// Authentication
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUser', username);
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('currentUser').textContent = username;
        initializeDashboard();
        showStatus('تم تسجيل الدخول بنجاح! مرحباً ' + username, 'success');
    } else {
        document.getElementById('loginError').style.display = 'block';
        setTimeout(() => {
            document.getElementById('loginError').style.display = 'none';
        }, 3000);
    }
}

function handleLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminUser');
        location.reload();
    }
}

// Check authentication on page load
window.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('adminAuth') === 'true') {
        const username = localStorage.getItem('adminUser') || 'المطور';
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('currentUser').textContent = username;
        initializeDashboard();
    }
});

// Initialize dashboard
async function initializeDashboard() {
    initializeEditor();
    await refreshAllData();
}

// Monaco Editor initialization
function initializeEditor() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('codeEditor'), {
            value: '<!-- اختر ملفاً للبدء في التحرير -->\n<!-- يمكنك تحرير أي ملف HTML, CSS, أو JavaScript من القائمة الجانبية -->',
            language: 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: 'on'
        });
    });
}

// Section navigation
function showSection(sectionName) {
    // Update sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('section-' + sectionName).classList.add('active');
    
    // Load data if needed
    if (sectionName === 'files') loadFiles();
    if (sectionName === 'images') loadImages();
    if (sectionName === 'pages') loadPages();
    if (sectionName === 'changelog') loadChangelog();
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    try {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Password': ADMIN_PASSWORD
            }
        };
        
        const response = await fetch(API_BASE + endpoint, {
            ...defaultOptions,
            ...options,
            headers: { ...defaultOptions.headers, ...options.headers }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'حدث خطأ في الاتصال');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showStatus('خطأ: ' + error.message, 'error');
        throw error;
    }
}

// Refresh all data
async function refreshAllData() {
    showStatus('جاري تحديث البيانات...', 'info');
    try {
        await Promise.all([
            loadFiles(),
            loadImages(),
            loadChangelog()
        ]);
        updateStats();
        showStatus('تم تحديث جميع البيانات بنجاح', 'success');
    } catch (error) {
        showStatus('حدث خطأ أثناء التحديث', 'error');
    }
}

// Update statistics
function updateStats() {
    document.getElementById('totalFiles').textContent = allFiles.length;
    document.getElementById('totalImages').textContent = allImages.length;
    document.getElementById('filesCount').textContent = allFiles.length;
    document.getElementById('imagesCount').textContent = allImages.length;
    
    // Count HTML pages
    const htmlPages = allFiles.filter(f => f.type === 'html').length;
    document.getElementById('activePages').textContent = htmlPages;
}

// File Management
async function loadFiles() {
    try {
        const files = await apiCall('/files');
        allFiles = files;
        displayFiles(files);
        updateStats();
    } catch (error) {
        document.getElementById('fileList').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <p>❌ فشل تحميل الملفات</p>
                <p style="font-size: 0.9em; color: #94a3b8;">${error.message}</p>
                <button class="btn btn-primary" onclick="loadFiles()" style="margin-top: 20px;">🔄 إعادة المحاولة</button>
            </div>
        `;
    }
}

function displayFiles(files) {
    const fileList = document.getElementById('fileList');
    
    if (files.length === 0) {
        fileList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #94a3b8;">
                <p>📁 لا توجد ملفات للعرض</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    files.forEach(file => {
        const icon = getFileIcon(file.type);
        const size = formatFileSize(file.size);
        const date = new Date(file.modified).toLocaleDateString('ar-EG');
        
        html += `
            <div class="file-card" data-filename="${file.name}" data-type="${file.type}">
                <div class="file-icon">${icon}</div>
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    <div>الحجم: ${size}</div>
                    <div>آخر تعديل: ${date}</div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-primary" onclick="editFile('${file.name}', '${file.type}')">✏️ تحرير</button>
                    <button class="btn btn-success" onclick="viewFile('${file.name}')">👁️ عرض</button>
                    <button class="btn btn-danger" onclick="deleteFile('${file.name}')">🗑️ حذف</button>
                </div>
            </div>
        `;
    });
    
    fileList.innerHTML = html;
}

function getFileIcon(type) {
    const icons = {
        'html': '📄',
        'css': '🎨',
        'js': '⚡',
        'json': '📋',
        'md': '📝'
    };
    return icons[type] || '📄';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function filterFiles() {
    const searchTerm = document.getElementById('fileSearch').value.toLowerCase();
    const typeFilter = document.getElementById('fileTypeFilter').value;
    
    const filtered = allFiles.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || file.type === typeFilter;
        return matchesSearch && matchesType;
    });
    
    displayFiles(filtered);
}

async function editFile(filename, fileType) {
    showSection('editor');
    currentFile = { name: filename, type: fileType };
    
    showStatus('جاري تحميل الملف...', 'info');
    
    try {
        const data = await apiCall(`/files/${filename}`);
        
        document.getElementById('editorFileName').textContent = filename;
        
        if (editor) {
            const language = fileType === 'html' ? 'html' 
                          : fileType === 'css' ? 'css' 
                          : fileType === 'js' ? 'javascript'
                          : fileType === 'json' ? 'json'
                          : fileType === 'md' ? 'markdown'
                          : 'plaintext';
            
            monaco.editor.setModelLanguage(editor.getModel(), language);
            editor.setValue(data.content);
        }
        
        showStatus('تم تحميل الملف بنجاح', 'success');
    } catch (error) {
        showStatus('فشل تحميل الملف: ' + error.message, 'error');
    }
}

function viewFile(filename) {
    window.open(filename, '_blank');
}

async function saveCurrentFile() {
    if (!currentFile) {
        showStatus('لم يتم تحديد ملف للحفظ', 'error');
        return;
    }
    
    const content = editor.getValue();
    
    showStatus('جاري حفظ الملف...', 'info');
    
    try {
        await apiCall(`/files/${currentFile.name}`, {
            method: 'POST',
            body: JSON.stringify({ content })
        });
        
        showStatus('✅ تم حفظ الملف بنجاح: ' + currentFile.name, 'success');
        loadFiles(); // Refresh file list
    } catch (error) {
        showStatus('❌ فشل حفظ الملف: ' + error.message, 'error');
    }
}

async function deleteFile(filename) {
    if (!confirm(`هل أنت متأكد من حذف الملف: ${filename}؟\n\nسيتم نقل الملف إلى سلة المحذوفات ويمكن استرجاعه لاحقاً.`)) {
        return;
    }
    
    showStatus('جاري حذف الملف...', 'info');
    
    try {
        await apiCall(`/files/${filename}`, {
            method: 'DELETE'
        });
        
        showStatus('✅ تم حذف الملف: ' + filename, 'success');
        loadFiles(); // Refresh file list
    } catch (error) {
        showStatus('❌ فشل حذف الملف: ' + error.message, 'error');
    }
}

function previewFile() {
    if (!currentFile) {
        showStatus('لم يتم تحديد ملف للمعاينة', 'error');
        return;
    }
    
    if (currentFile.type !== 'html') {
        showStatus('يمكن معاينة ملفات HTML فقط', 'error');
        return;
    }
    
    const content = editor.getValue();
    const previewContainer = document.getElementById('previewContainer');
    const previewFrame = document.getElementById('previewFrame');
    
    previewContainer.style.display = 'block';
    
    // Create a blob URL and load it in the iframe
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
    
    showStatus('تم تحميل المعاينة', 'success');
}

function closePreview() {
    document.getElementById('previewContainer').style.display = 'none';
}

function downloadFile() {
    if (!currentFile) {
        showStatus('لم يتم تحديد ملف للتنزيل', 'error');
        return;
    }
    
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showStatus('تم تنزيل الملف', 'success');
}

function closeEditor() {
    if (editor) {
        editor.setValue('<!-- اختر ملفاً للبدء في التحرير -->');
    }
    currentFile = null;
    document.getElementById('editorFileName').textContent = 'لم يتم تحديد ملف';
    closePreview();
}

// Image Management
async function loadImages() {
    try {
        const images = await apiCall('/images');
        allImages = images;
        displayImages(images);
        updateStats();
    } catch (error) {
        document.getElementById('imageGrid').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <p>❌ فشل تحميل الصور</p>
                <p style="font-size: 0.9em; color: #94a3b8;">${error.message}</p>
                <button class="btn btn-primary" onclick="loadImages()" style="margin-top: 20px;">🔄 إعادة المحاولة</button>
            </div>
        `;
    }
}

function displayImages(images) {
    const imageGrid = document.getElementById('imageGrid');
    
    if (images.length === 0) {
        imageGrid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #94a3b8;">
                <p>🖼️ لا توجد صور للعرض</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    images.forEach(img => {
        const size = formatFileSize(img.size);
        
        html += `
            <div class="image-card" data-imagename="${img.name}">
                <img src="${img.url}" alt="${img.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Crect fill=%27%23334155%27 width=%27200%27 height=%27200%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%2394a3b8%27 font-size=%2714%27%3E${img.name}%3C/text%3E%3C/svg%3E'">
                <div class="image-info">
                    <div class="image-name">${img.name}</div>
                    <div class="image-size">${size}</div>
                    <div class="image-actions">
                        <button class="btn btn-primary" onclick="viewImage('${img.url}')">👁️ عرض</button>
                        <button class="btn btn-danger" onclick="deleteImage('${img.name}')">🗑️ حذف</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    imageGrid.innerHTML = html;
}

function filterImages() {
    const searchTerm = document.getElementById('imageSearch').value.toLowerCase();
    
    const filtered = allImages.filter(img => 
        img.name.toLowerCase().includes(searchTerm)
    );
    
    displayImages(filtered);
}

async function handleImageUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    
    showStatus(`جاري رفع ${files.length} صورة...`, 'info');
    
    try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        
        const response = await fetch(API_BASE + '/images', {
            method: 'POST',
            headers: {
                'X-Admin-Password': ADMIN_PASSWORD
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('فشل رفع الصور');
        }
        
        const result = await response.json();
        showStatus(`✅ تم رفع ${result.files.length} صورة بنجاح`, 'success');
        loadImages(); // Refresh image list
        
        // Reset file input
        event.target.value = '';
    } catch (error) {
        showStatus('❌ فشل رفع الصور: ' + error.message, 'error');
    }
}

function viewImage(imageUrl) {
    window.open(imageUrl, '_blank');
}

async function deleteImage(imageName) {
    if (!confirm(`هل أنت متأكد من حذف الصورة: ${imageName}؟\n\nسيتم نقل الصورة إلى سلة المحذوفات ويمكن استرجاعها لاحقاً.`)) {
        return;
    }
    
    showStatus('جاري حذف الصورة...', 'info');
    
    try {
        await apiCall(`/images/${imageName}`, {
            method: 'DELETE'
        });
        
        showStatus('✅ تم حذف الصورة: ' + imageName, 'success');
        loadImages(); // Refresh image list
    } catch (error) {
        showStatus('❌ فشل حذف الصورة: ' + error.message, 'error');
    }
}

function uploadImages() {
    showSection('images');
    document.getElementById('imageUpload').click();
}

// New file creation
function createNewFile() {
    openModal('createFileModal');
}

async function submitNewFile(event) {
    event.preventDefault();
    const fileName = document.getElementById('newFileName').value;
    const fileType = document.getElementById('newFileType').value;
    
    showStatus('جاري إنشاء الملف...', 'info');
    
    try {
        // Create template content based on file type
        let content = '';
        if (fileType === 'html') {
            content = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>صفحة جديدة</title>
</head>
<body>
    <h1>مرحباً بك</h1>
</body>
</html>`;
        } else if (fileType === 'css') {
            content = `/* ملف CSS جديد */\n\nbody {\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n}\n`;
        } else if (fileType === 'js') {
            content = `// ملف JavaScript جديد\n\nconsole.log('مرحباً');\n`;
        } else if (fileType === 'json') {
            content = `{\n    "name": "config",\n    "version": "1.0.0"\n}\n`;
        } else if (fileType === 'md') {
            content = `# ملف Markdown جديد\n\nمحتوى الملف هنا...\n`;
        }
        
        await apiCall('/files', {
            method: 'POST',
            body: JSON.stringify({ filename: fileName, content })
        });
        
        closeModal('createFileModal');
        showStatus('✅ تم إنشاء الملف: ' + fileName, 'success');
        
        // Clear form
        document.getElementById('newFileName').value = '';
        
        // Refresh and open file
        await loadFiles();
        editFile(fileName, fileType);
    } catch (error) {
        showStatus('❌ فشل إنشاء الملف: ' + error.message, 'error');
    }
}

// Pages Management
async function loadPages() {
    const htmlFiles = allFiles.filter(f => f.type === 'html');
    const pageList = document.getElementById('pageList');
    
    if (htmlFiles.length === 0) {
        pageList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #94a3b8;">
                <p>🌐 لا توجد صفحات للعرض</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    htmlFiles.forEach(page => {
        html += `
            <div class="page-item">
                <div class="page-info">
                    <div class="page-name">${page.name}</div>
                    <div class="page-url">/${page.name}</div>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="editFile('${page.name}', 'html')">✏️ تحرير</button>
                    <button class="btn btn-success" onclick="viewFile('${page.name}')">👁️ عرض</button>
                    <button class="btn btn-warning" onclick="setAsMain('${page.name}')">🏠 رئيسية</button>
                </div>
            </div>
        `;
    });
    
    pageList.innerHTML = html;
}

function setAsMain(pageName) {
    showStatus(`تم تعيين ${pageName} كصفحة رئيسية`, 'success');
    // In a real implementation, this would update index.html to redirect to this page
}

function setAsHomePage() {
    showStatus('يرجى اختيار صفحة أولاً', 'info');
}

// Configuration Management
async function saveConfig() {
    const siteName = document.getElementById('siteName').value;
    const mainPage = document.getElementById('mainPage').value;
    const siteTheme = document.getElementById('siteTheme').value;
    
    const config = {
        siteName,
        mainPage,
        theme: siteTheme
    };
    
    showStatus('جاري حفظ الإعدادات...', 'info');
    
    try {
        await apiCall('/config', {
            method: 'POST',
            body: JSON.stringify(config)
        });
        
        showStatus('✅ تم حفظ الإعدادات بنجاح', 'success');
    } catch (error) {
        showStatus('❌ فشل حفظ الإعدادات: ' + error.message, 'error');
    }
}

// Changelog Management
async function loadChangelog() {
    try {
        const changelog = await apiCall('/changelog');
        displayChangelog(changelog);
        document.getElementById('backupCount').textContent = changelog.length;
    } catch (error) {
        document.getElementById('changelogBody').innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: #ef4444;">
                    ❌ فشل تحميل السجل
                </td>
            </tr>
        `;
    }
}

function displayChangelog(changelog) {
    const tbody = document.getElementById('changelogBody');
    
    if (changelog.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: #94a3b8;">
                    📜 لا توجد نسخ احتياطية
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    changelog.forEach(item => {
        const date = new Date(item.timestamp).toLocaleString('ar-EG');
        const size = formatFileSize(item.size);
        
        html += `
            <tr>
                <td>${item.filename}</td>
                <td>${date}</td>
                <td>${size}</td>
                <td>
                    <button class="btn btn-primary" onclick="restoreBackup('${item.filename}')" style="padding: 5px 15px; font-size: 0.9em;">
                        🔄 استرجاع
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

async function restoreBackup(backupFile) {
    if (!confirm(`هل أنت متأكد من استرجاع هذه النسخة الاحتياطية؟\n${backupFile}\n\nسيتم استبدال الملف الحالي.`)) {
        return;
    }
    
    showStatus('جاري استرجاع النسخة الاحتياطية...', 'info');
    
    try {
        await apiCall(`/restore/${backupFile}`, {
            method: 'POST'
        });
        
        showStatus('✅ تم استرجاع النسخة الاحتياطية بنجاح', 'success');
        loadFiles();
    } catch (error) {
        showStatus('❌ فشل استرجاع النسخة الاحتياطية: ' + error.message, 'error');
    }
}

function clearOldBackups() {
    showStatus('هذه الميزة قيد التطوير', 'info');
}

// Modal management
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Status messages
function showStatus(message, type = 'info') {
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message status-${type}`;
    statusDiv.textContent = message;
    document.body.appendChild(statusDiv);
    
    setTimeout(() => {
        statusDiv.style.animation = 'fadeInUp 0.4s ease reverse';
        setTimeout(() => statusDiv.remove(), 400);
    }, 3000);
}

// Drag and drop for image upload
const uploadArea = document.querySelector('.upload-area');
if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#3b82f6';
        uploadArea.style.background = 'rgba(59, 130, 246, 0.2)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#334155';
        uploadArea.style.background = 'rgba(59, 130, 246, 0.05)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#334155';
        uploadArea.style.background = 'rgba(59, 130, 246, 0.05)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const imageInput = document.getElementById('imageUpload');
            imageInput.files = files;
            handleImageUpload({ target: imageInput });
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
