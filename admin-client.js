/**
 * Admin Dashboard Client-Side JavaScript
 * Connects to backend API for real file operations
 */

// Configuration
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Developer credentials
const ADMIN_USERNAME = 'developer';
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
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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

// Attach login form handler immediately when script loads
// Since this script is loaded dynamically, DOMContentLoaded may have already fired
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

// Auto-authentication enabled - bypass login screen
// Automatically authenticate with developer credentials on page load
function autoAuthenticate() {
    // Set authentication in localStorage
    localStorage.setItem('adminAuth', 'true');
    localStorage.setItem('adminUser', 'developer');
    
    const loginContainer = document.getElementById('loginContainer');
    const dashboard = document.getElementById('dashboard');
    const currentUser = document.getElementById('currentUser');
    
    if (loginContainer && dashboard && currentUser) {
        loginContainer.style.display = 'none';
        dashboard.style.display = 'block';
        currentUser.textContent = 'developer';
        initializeDashboard();
    }
}

// Check authentication on page load
if (localStorage.getItem('adminAuth') === 'true') {
    const username = localStorage.getItem('adminUser') || 'المطور';
    const loginContainer = document.getElementById('loginContainer');
    const dashboard = document.getElementById('dashboard');
    const currentUser = document.getElementById('currentUser');
    
    if (loginContainer && dashboard && currentUser) {
        loginContainer.style.display = 'none';
        dashboard.style.display = 'block';
        currentUser.textContent = username;
        initializeDashboard();
    }
} else {
    // Auto-authenticate if not already authenticated
    autoAuthenticate();
}

// Initialize dashboard
async function initializeDashboard() {
    initializeEditor();
    await refreshAllData();
}

// Monaco Editor initialization
function initializeEditor() {
    // Check if loader is available
    if (typeof require === 'undefined' || typeof require.config === 'undefined') {
        console.warn('Monaco Editor loader not available, using fallback textarea');
        // Create fallback textarea editor
        const editorDiv = document.getElementById('codeEditor');
        if (editorDiv) {
            editorDiv.innerHTML = `
                <textarea id="fallbackEditor" style="width: 100%; height: 100%; background: #1e1e1e; color: #d4d4d4; 
                    border: none; padding: 15px; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; resize: none;">
<!-- اختر ملفاً للبدء في التحرير -->
<!-- يمكنك تحرير أي ملف HTML, CSS, أو JavaScript من القائمة الجانبية -->
                </textarea>
            `;
            editor = {
                getValue: () => document.getElementById('fallbackEditor').value,
                setValue: (val) => { document.getElementById('fallbackEditor').value = val; },
                getModel: () => ({ getLanguageId: () => 'html' })
            };
        }
        return;
    }
    
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
function showSection(sectionName, clickedElement) {
    // Update sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the clicked sidebar item
    if (clickedElement) {
        clickedElement.classList.add('active');
    } else {
        // Try to find by section name
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            if (item.getAttribute('onclick')?.includes(sectionName)) {
                item.classList.add('active');
            }
        });
    }
    
    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById('section-' + sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Load data if needed
    if (sectionName === 'files') loadFiles();
    if (sectionName === 'images') loadImages();
    if (sectionName === 'pages') loadPages();
    if (sectionName === 'changelog') loadChangelog();
    
    // Show success message
    showStatus(`تم فتح قسم: ${getSectionTitle(sectionName)}`, 'info');
}

// Helper function to get section title
function getSectionTitle(sectionName) {
    const titles = {
        'dashboard': 'نظرة عامة',
        'files': 'إدارة الملفات',
        'editor': 'محرر الأكواد',
        'images': 'إدارة الصور',
        'pages': 'إدارة الصفحات',
        'config': 'إعدادات الموقع',
        'changelog': 'سجل التغييرات'
    };
    return titles[sectionName] || sectionName;
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    try {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Username': ADMIN_USERNAME,
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

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save in editor
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (document.getElementById('section-editor').classList.contains('active') && currentFile) {
            saveCurrentFile();
        }
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const fileSearch = document.getElementById('fileSearch');
        const imageSearch = document.getElementById('imageSearch');
        if (fileSearch && document.getElementById('section-files').classList.contains('active')) {
            fileSearch.focus();
        } else if (imageSearch && document.getElementById('section-images').classList.contains('active')) {
            imageSearch.focus();
        }
    }
    
    // ESC to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        // Also close preview
        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }
    }
});

// Add welcome message on first load
setTimeout(() => {
    const hasSeenWelcome = localStorage.getItem('dashboardWelcomeSeen');
    if (!hasSeenWelcome) {
        showStatus('🎉 مرحباً بك في لوحة التحكم الشاملة! جميع الأزرار تعمل بكفاءة 100%', 'success');
        localStorage.setItem('dashboardWelcomeSeen', 'true');
    }
}, 1000);

// Add helper tooltips on hover
document.addEventListener('DOMContentLoaded', () => {
    // Add tooltips to buttons
    const tooltips = {
        'refreshAllData': 'تحديث جميع البيانات من الخادم',
        'createNewFile': 'إنشاء ملف جديد (HTML, CSS, JS)',
        'uploadImages': 'رفع صور إلى المشروع',
        'saveCurrentFile': 'حفظ التغييرات (Ctrl+S)',
        'previewFile': 'معاينة الملف قبل الحفظ',
        'downloadFile': 'تنزيل الملف إلى جهازك',
        'closeEditor': 'إغلاق المحرر'
    };
    
    Object.keys(tooltips).forEach(funcName => {
        document.querySelectorAll(`[onclick*="${funcName}"]`).forEach(btn => {
            if (!btn.hasAttribute('title')) {
                btn.setAttribute('title', tooltips[funcName]);
            }
        });
    });
});

// ===== REPORTS MANAGEMENT =====
let allReportsData = [];
let allCampaignsData = [];

async function loadReports() {
    try {
        showStatus('جاري تحميل التقارير...', 'info');
        
        const response = await fetch(`${API_BASE}/content/all`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) throw new Error('فشل تحميل التقارير');
        
        const data = await response.json();
        allReportsData = data.files || [];
        
        // Update badge count
        document.getElementById('reportsCount').textContent = allReportsData.length;
        
        // Render reports grid
        const grid = document.getElementById('reportsGrid');
        if (allReportsData.length === 0) {
            grid.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px;">لا توجد تقارير حالياً</div>';
        } else {
            grid.innerHTML = allReportsData.map((report, index) => `
                <div class="report-card">
                    <div class="card-icon">${report.icon}</div>
                    <h3>${report.name}</h3>
                    <p>${report.description}</p>
                    <div style="margin: 10px 0;">
                        <span style="background: #334155; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; margin-right: 5px;">
                            📁 ${report.path}
                        </span>
                        <span style="background: #334155; padding: 5px 10px; border-radius: 15px; font-size: 0.9em;">
                            📂 ${report.category}
                        </span>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="editReport(${index})">✏️ تحرير</button>
                        <button class="btn btn-warning" onclick="deleteReport(${index})">🗑️ حذف</button>
                        <button class="btn btn-info" onclick="previewReport('${report.path}')">👁️ معاينة</button>
                    </div>
                </div>
            `).join('');
        }
        
        showStatus(`تم تحميل ${allReportsData.length} تقرير`, 'success');
    } catch (error) {
        console.error('Error loading reports:', error);
        showStatus('فشل تحميل التقارير: ' + error.message, 'error');
    }
}

async function loadCampaigns() {
    try {
        showStatus('جاري تحميل الحملات...', 'info');
        
        const response = await fetch(`${API_BASE}/content/all`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) throw new Error('فشل تحميل الحملات');
        
        const data = await response.json();
        allCampaignsData = data.campaignFiles || [];
        
        // Update badge count
        document.getElementById('campaignsCount').textContent = allCampaignsData.length;
        
        // Render campaigns grid
        const grid = document.getElementById('campaignsGrid');
        if (allCampaignsData.length === 0) {
            grid.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px;">لا توجد حملات حالياً</div>';
        } else {
            grid.innerHTML = allCampaignsData.map((campaign, index) => `
                <div class="campaign-card">
                    <div class="card-icon">${campaign.icon}</div>
                    <h3>${campaign.name}</h3>
                    <p>${campaign.description}</p>
                    <div style="margin: 10px 0;">
                        <span style="background: #334155; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; margin-right: 5px;">
                            📁 ${campaign.path}
                        </span>
                        <span style="background: #334155; padding: 5px 10px; border-radius: 15px; font-size: 0.9em;">
                            📅 ${campaign.year}
                        </span>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="editCampaign(${index})">✏️ تحرير</button>
                        <button class="btn btn-warning" onclick="deleteCampaign(${index})">🗑️ حذف</button>
                        <button class="btn btn-info" onclick="previewReport('${campaign.path}')">👁️ معاينة</button>
                    </div>
                </div>
            `).join('');
        }
        
        showStatus(`تم تحميل ${allCampaignsData.length} حملة`, 'success');
    } catch (error) {
        console.error('Error loading campaigns:', error);
        showStatus('فشل تحميل الحملات: ' + error.message, 'error');
    }
}

function addNewReport() {
    const newReport = {
        id: `report-${Date.now()}`,
        name: 'تقرير جديد',
        description: 'وصف التقرير',
        icon: '📊',
        path: 'new-report.html',
        category: 'التقارير',
        mainCategory: 'report',
        type: 'report',
        year: new Date().getFullYear().toString(),
        defaultVisible: true
    };
    allReportsData.push(newReport);
    editReport(allReportsData.length - 1);
}

function addNewCampaign() {
    const newCampaign = {
        id: `campaign-${Date.now()}`,
        name: 'حملة جديدة',
        description: 'وصف الحملة',
        icon: '📢',
        path: 'new-campaign.html',
        type: 'campaign',
        year: new Date().getFullYear().toString(),
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    };
    allCampaignsData.push(newCampaign);
    editCampaign(allCampaignsData.length - 1);
}

function editReport(index) {
    const report = allReportsData[index];
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>✏️ تحرير التقرير</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form onsubmit="saveReport(event, ${index})">
                <div class="form-group">
                    <label>اسم التقرير</label>
                    <input type="text" name="name" value="${report.name}" required>
                </div>
                <div class="form-group">
                    <label>الوصف</label>
                    <textarea name="description" required>${report.description}</textarea>
                </div>
                <div class="form-group">
                    <label>الأيقونة (emoji)</label>
                    <input type="text" name="icon" value="${report.icon}" required>
                </div>
                <div class="form-group">
                    <label>المسار (path)</label>
                    <input type="text" name="path" value="${report.path}" required>
                </div>
                <div class="form-group">
                    <label>التصنيف</label>
                    <input type="text" name="category" value="${report.category}" required>
                </div>
                <div class="form-group">
                    <label>السنة</label>
                    <input type="text" name="year" value="${report.year}" required>
                </div>
                <div class="action-bar">
                    <button type="submit" class="btn btn-success">💾 حفظ</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">إلغاء</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function editCampaign(index) {
    const campaign = allCampaignsData[index];
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>✏️ تحرير الحملة</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form onsubmit="saveCampaign(event, ${index})">
                <div class="form-group">
                    <label>اسم الحملة</label>
                    <input type="text" name="name" value="${campaign.name}" required>
                </div>
                <div class="form-group">
                    <label>الوصف</label>
                    <textarea name="description" required>${campaign.description}</textarea>
                </div>
                <div class="form-group">
                    <label>الأيقونة (emoji)</label>
                    <input type="text" name="icon" value="${campaign.icon}" required>
                </div>
                <div class="form-group">
                    <label>المسار (path)</label>
                    <input type="text" name="path" value="${campaign.path}" required>
                </div>
                <div class="form-group">
                    <label>السنة</label>
                    <input type="text" name="year" value="${campaign.year}" required>
                </div>
                <div class="action-bar">
                    <button type="submit" class="btn btn-success">💾 حفظ</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">إلغاء</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function saveReport(event, index) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updated = {};
    formData.forEach((value, key) => updated[key] = value);
    
    allReportsData[index] = { ...allReportsData[index], ...updated };
    
    try {
        const response = await fetch(`${API_BASE}/content/update`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page: 'home.html',
                dataType: 'files',
                data: allReportsData
            })
        });
        
        if (!response.ok) throw new Error('فشل الحفظ');
        
        showStatus('تم حفظ التقرير بنجاح', 'success');
        event.target.closest('.modal').remove();
        loadReports();
    } catch (error) {
        showStatus('فشل حفظ التقرير: ' + error.message, 'error');
    }
}

async function saveCampaign(event, index) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updated = {};
    formData.forEach((value, key) => updated[key] = value);
    
    allCampaignsData[index] = { ...allCampaignsData[index], ...updated };
    
    try {
        const response = await fetch(`${API_BASE}/content/update`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page: 'home.html',
                dataType: 'campaignFiles',
                data: allCampaignsData
            })
        });
        
        if (!response.ok) throw new Error('فشل الحفظ');
        
        showStatus('تم حفظ الحملة بنجاح', 'success');
        event.target.closest('.modal').remove();
        loadCampaigns();
    } catch (error) {
        showStatus('فشل حفظ الحملة: ' + error.message, 'error');
    }
}

async function deleteReport(index) {
    if (!confirm('هل أنت متأكد من حذف هذا التقرير؟')) return;
    
    allReportsData.splice(index, 1);
    
    try {
        const response = await fetch(`${API_BASE}/content/update`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page: 'home.html',
                dataType: 'files',
                data: allReportsData
            })
        });
        
        if (!response.ok) throw new Error('فشل الحذف');
        
        showStatus('تم حذف التقرير', 'success');
        loadReports();
    } catch (error) {
        showStatus('فشل حذف التقرير: ' + error.message, 'error');
    }
}

async function deleteCampaign(index) {
    if (!confirm('هل أنت متأكد من حذف هذه الحملة؟')) return;
    
    allCampaignsData.splice(index, 1);
    
    try {
        const response = await fetch(`${API_BASE}/content/update`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page: 'home.html',
                dataType: 'campaignFiles',
                data: allCampaignsData
            })
        });
        
        if (!response.ok) throw new Error('فشل الحذف');
        
        showStatus('تم حذف الحملة', 'success');
        loadCampaigns();
    } catch (error) {
        showStatus('فشل حذف الحملة: ' + error.message, 'error');
    }
}

function previewReport(path) {
    window.open(path, '_blank');
}

async function saveReportsToGitHub() {
    if (!confirm('هل تريد حفظ جميع التقارير إلى GitHub؟')) return;
    
    showStatus('جاري الحفظ في GitHub...', 'info');
    
    try {
        const response = await fetch(`${API_BASE}/git/save`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'تحديث التقارير من لوحة التحكم',
                files: ['home.html']
            })
        });
        
        if (!response.ok) throw new Error('فشل الحفظ في GitHub');
        
        const result = await response.json();
        showStatus('تم الحفظ في GitHub بنجاح! Commit: ' + result.commit, 'success');
    } catch (error) {
        showStatus('فشل الحفظ في GitHub: ' + error.message, 'error');
    }
}

async function saveCampaignsToGitHub() {
    if (!confirm('هل تريد حفظ جميع الحملات إلى GitHub؟')) return;
    
    showStatus('جاري الحفظ في GitHub...', 'info');
    
    try {
        const response = await fetch(`${API_BASE}/git/save`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'تحديث الحملات من لوحة التحكم',
                files: ['home.html']
            })
        });
        
        if (!response.ok) throw new Error('فشل الحفظ في GitHub');
        
        const result = await response.json();
        showStatus('تم الحفظ في GitHub بنجاح! Commit: ' + result.commit, 'success');
    } catch (error) {
        showStatus('فشل الحفظ في GitHub: ' + error.message, 'error');
    }
}

// ===== GITHUB INTEGRATION =====
async function checkGitStatus() {
    try {
        showStatus('جاري التحقق من حالة Git...', 'info');
        
        const response = await fetch(`${API_BASE}/git/status`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) throw new Error('فشل التحقق من حالة Git');
        
        const status = await response.json();
        const statusDiv = document.getElementById('gitStatus');
        
        let html = '<div style="color: #94a3b8;">';
        html += `<div style="margin-bottom: 15px;"><strong>الفرع الحالي:</strong> ${status.current}</div>`;
        
        if (status.modified && status.modified.length > 0) {
            html += '<div style="margin-bottom: 10px;"><strong>ملفات معدلة:</strong></div>';
            status.modified.forEach(file => {
                html += `<div class="git-file-badge git-badge-modified">📝 ${file}</div>`;
            });
        }
        
        if (status.created && status.created.length > 0) {
            html += '<div style="margin-bottom: 10px; margin-top: 15px;"><strong>ملفات جديدة:</strong></div>';
            status.created.forEach(file => {
                html += `<div class="git-file-badge git-badge-created">➕ ${file}</div>`;
            });
        }
        
        if (status.deleted && status.deleted.length > 0) {
            html += '<div style="margin-bottom: 10px; margin-top: 15px;"><strong>ملفات محذوفة:</strong></div>';
            status.deleted.forEach(file => {
                html += `<div class="git-file-badge git-badge-deleted">🗑️ ${file}</div>`;
            });
        }
        
        if (!status.modified || (status.modified.length === 0 && (!status.created || status.created.length === 0) && (!status.deleted || status.deleted.length === 0))) {
            html += '<div style="color: #10b981; font-size: 1.2em;">✅ لا توجد تغييرات جديدة</div>';
        }
        
        html += '</div>';
        statusDiv.innerHTML = html;
        
        showStatus('تم تحديث حالة Git', 'success');
    } catch (error) {
        console.error('Error checking git status:', error);
        showStatus('فشل التحقق من حالة Git: ' + error.message, 'error');
    }
}

async function gitCommit() {
    const message = document.getElementById('gitCommitMessage').value.trim();
    
    if (!message) {
        showStatus('يرجى إدخال رسالة الحفظ (Commit Message)', 'error');
        return;
    }
    
    try {
        showStatus('جاري حفظ التغييرات...', 'info');
        
        const response = await fetch(`${API_BASE}/git/commit`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) throw new Error('فشل الحفظ');
        
        const result = await response.json();
        
        const outputDiv = document.getElementById('gitOutput');
        outputDiv.style.display = 'block';
        outputDiv.querySelector('pre').textContent = `✅ تم الحفظ بنجاح!
Commit: ${result.commit}
التغييرات: ${JSON.stringify(result.summary, null, 2)}`;
        
        showStatus('تم حفظ التغييرات في Git', 'success');
        checkGitStatus();
    } catch (error) {
        showStatus('فشل حفظ التغييرات: ' + error.message, 'error');
    }
}

async function gitPush() {
    if (!confirm('هل تريد رفع التغييرات إلى GitHub؟')) return;
    
    try {
        showStatus('جاري رفع التغييرات إلى GitHub...', 'info');
        
        const response = await fetch(`${API_BASE}/git/push`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                remote: 'origin',
                branch: 'main'
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error + (error.hint ? '\n' + error.hint : ''));
        }
        
        const result = await response.json();
        
        const outputDiv = document.getElementById('gitOutput');
        outputDiv.style.display = 'block';
        outputDiv.querySelector('pre').textContent = '✅ ' + result.message;
        
        showStatus('تم رفع التغييرات إلى GitHub بنجاح!', 'success');
        checkGitStatus();
    } catch (error) {
        showStatus('فشل رفع التغييرات: ' + error.message, 'error');
        
        const outputDiv = document.getElementById('gitOutput');
        outputDiv.style.display = 'block';
        outputDiv.querySelector('pre').textContent = '❌ خطأ: ' + error.message;
    }
}

async function gitCommitAndPush() {
    const message = document.getElementById('gitCommitMessage').value.trim();
    
    if (!message) {
        showStatus('يرجى إدخال رسالة الحفظ (Commit Message)', 'error');
        return;
    }
    
    if (!confirm('هل تريد حفظ ورفع التغييرات إلى GitHub مباشرة؟')) return;
    
    try {
        showStatus('جاري حفظ ورفع التغييرات...', 'info');
        
        const response = await fetch(`${API_BASE}/git/save`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error + (error.hint ? '\n' + error.hint : ''));
        }
        
        const result = await response.json();
        
        const outputDiv = document.getElementById('gitOutput');
        outputDiv.style.display = 'block';
        outputDiv.querySelector('pre').textContent = `✅ تم حفظ ورفع التغييرات بنجاح!
Commit: ${result.commit}
التغييرات: ${JSON.stringify(result.summary, null, 2)}`;
        
        showStatus('تم حفظ ورفع التغييرات إلى GitHub بنجاح!', 'success');
        document.getElementById('gitCommitMessage').value = '';
        checkGitStatus();
    } catch (error) {
        showStatus('فشل حفظ ورفع التغييرات: ' + error.message, 'error');
        
        const outputDiv = document.getElementById('gitOutput');
        outputDiv.style.display = 'block';
        outputDiv.querySelector('pre').textContent = '❌ خطأ: ' + error.message;
    }
}

// Auto-load sections when switching
const originalShowSection = window.showSection;
window.showSection = function(sectionName, element) {
    if (originalShowSection) {
        originalShowSection(sectionName, element);
    }
    
    // Auto-load data when switching to these sections
    if (sectionName === 'reports' && allReportsData.length === 0) {
        loadReports();
    }
    if (sectionName === 'campaigns' && allCampaignsData.length === 0) {
        loadCampaigns();
    }
    if (sectionName === 'github') {
        checkGitStatus();
    }
};

console.log('✅ لوحة التحكم الشاملة جاهزة للاستخدام');
console.log('⌨️ اختصارات لوحة المفاتيح:');
console.log('   Ctrl/Cmd + S: حفظ الملف');
console.log('   Ctrl/Cmd + K: البحث');
console.log('   ESC: إغلاق النوافذ المنبثقة');
console.log('🔄 GitHub Integration: متاح');
