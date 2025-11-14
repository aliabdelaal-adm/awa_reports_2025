/**
 * Admin Dashboard Client-Side JavaScript - Standalone Version
 * Works without backend server for static hosting (GitHub Pages, etc.)
 */

// Global variables
let currentFile = null;
let editor = null;
let allFiles = [];
let allImages = [];
const ADMIN_PASSWORD = '1940';

// File definitions - Static list of editable files
const staticFiles = [
    { name: 'home.html', type: 'html' },
    { name: 'gallery-view.html', type: 'html' },
    { name: 'index2.html', type: 'html' },
    { name: 'index.html', type: 'html' },
    { name: 'smart-planner.html', type: 'html' },
    { name: 'plan-data.html', type: 'html' },
    { name: 'report-data.html', type: 'html' },
    { name: 'timeline-view.html', type: 'html' },
    { name: 'test_viewer_mode.html', type: 'html' },
    { name: 'ai-background.css', type: 'css' },
    { name: 'ai-background.js', type: 'js' },
    { name: 'ai-campaign-features.js', type: 'js' },
    { name: 'admin-client.js', type: 'js' },
    { name: 'admin-client-standalone.js', type: 'js' }
];

const staticImages = [
    'IMG-20250217-WA0011.jpg',
    'IMG-20250217-WA0012.jpg',
    'IMG-20250217-WA0018.jpg',
    'IMG-20250301-WA0013.jpg',
    'IMG-20250301-WA0018.jpg',
    'IMG-20250301-WA0020.jpg',
    'IMG-20250301-WA0028.jpg',
    'IMG-20250301-WA0030.jpg',
    'IMG-20250303-WA0006.jpg',
    '398cd88d-05e6-46a6-9a47-69d0fb7b2806.jpeg',
    '4c6f9779-bc60-40b6-8e47-e07637966a8b.jpeg',
    '543ee0e9-8b8c-43cf-9c67-5d9fd1750f64.jpeg',
    '752d5b9a-4696-4382-b895-bdf14e984335.jpeg',
    '8415e3d3-ae8b-4ecf-b567-3a0965bca9a5.jpeg',
    '8cf07a0c-b4b0-4b8d-94a6-743e45c4e403.jpeg',
    'ace39a9a-0661-445d-b828-537ca283d575.jpeg',
    'b64c13b8-12f8-479b-bb61-3423546fba50 (1).jpeg',
    'd2366589-a716-4093-848a-cdff041375a1.jpeg',
    'e765ed80-f3aa-4df8-91d9-048bb2b770c3.jpeg',
    'WhatsApp Image 2025-03-01 at 17.34.36_fba866f5.jpg'
];

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

// Attach login form handler immediately when script loads
// Since this script is loaded dynamically, DOMContentLoaded may have already fired
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
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
}

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
            value: '<!-- اختر ملفاً للبدء في التحرير -->\n<!-- في هذا الوضع، يمكنك تحرير الملفات وحفظها محلياً -->\n<!-- لحفظ التغييرات في الموقع الفعلي، استخدم زر "تنزيل" ثم قم برفع الملف يدوياً -->',
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
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
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
    
    const htmlPages = allFiles.filter(f => f.type === 'html').length;
    document.getElementById('activePages').textContent = htmlPages;
    
    const savedFiles = Object.keys(localStorage).filter(k => k.startsWith('file_')).length;
    document.getElementById('backupCount').textContent = savedFiles;
}

// File Management
async function loadFiles() {
    try {
        // Use static file list
        allFiles = staticFiles.map(file => ({
            ...file,
            path: file.name,
            size: 0, // Will be updated when loaded
            modified: new Date()
        }));
        
        displayFiles(allFiles);
        updateStats();
    } catch (error) {
        document.getElementById('fileList').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <p>❌ فشل تحميل الملفات</p>
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
        const hasLocalCopy = localStorage.getItem('file_' + file.name) !== null;
        
        html += `
            <div class="file-card" data-filename="${file.name}" data-type="${file.type}">
                <div class="file-icon">${icon}</div>
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    <div>${hasLocalCopy ? '💾 نسخة محفوظة محلياً' : '📄 ملف أصلي'}</div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-primary" onclick="editFile('${file.name}', '${file.type}')">✏️ تحرير</button>
                    <button class="btn btn-success" onclick="viewFile('${file.name}')">👁️ عرض</button>
                    ${hasLocalCopy ? `<button class="btn btn-warning" onclick="clearLocalFile('${file.name}')">🔄 استعادة الأصلي</button>` : ''}
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
        // Check if we have a local copy first
        let content = localStorage.getItem('file_' + filename);
        
        if (!content) {
            // Try to fetch from server
            const response = await fetch(filename);
            if (response.ok) {
                content = await response.text();
            } else {
                // Create empty file
                content = createTemplateContent(fileType);
            }
        }
        
        document.getElementById('editorFileName').textContent = filename;
        
        if (editor) {
            const language = fileType === 'html' ? 'html' 
                          : fileType === 'css' ? 'css' 
                          : fileType === 'js' ? 'javascript'
                          : fileType === 'json' ? 'json'
                          : fileType === 'md' ? 'markdown'
                          : 'plaintext';
            
            monaco.editor.setModelLanguage(editor.getModel(), language);
            editor.setValue(content);
        }
        
        showStatus('تم تحميل الملف بنجاح', 'success');
    } catch (error) {
        showStatus('فشل تحميل الملف: ' + error.message, 'error');
    }
}

function createTemplateContent(fileType) {
    if (fileType === 'html') {
        return `<!DOCTYPE html>
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
        return `/* ملف CSS جديد */\n\nbody {\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n}\n`;
    } else if (fileType === 'js') {
        return `// ملف JavaScript جديد\n\nconsole.log('مرحباً');\n`;
    } else if (fileType === 'json') {
        return `{\n    "name": "config",\n    "version": "1.0.0"\n}\n`;
    } else if (fileType === 'md') {
        return `# ملف Markdown جديد\n\nمحتوى الملف هنا...\n`;
    }
    return '';
}

function viewFile(filename) {
    // Check if we have a local copy
    const localContent = localStorage.getItem('file_' + filename);
    if (localContent) {
        const blob = new Blob([localContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    } else {
        window.open(filename, '_blank');
    }
}

function saveCurrentFile() {
    if (!currentFile) {
        showStatus('لم يتم تحديد ملف للحفظ', 'error');
        return;
    }
    
    const content = editor.getValue();
    
    // Save to localStorage
    const timestamp = new Date().toISOString();
    localStorage.setItem('file_' + currentFile.name, content);
    localStorage.setItem('file_' + currentFile.name + '_timestamp', timestamp);
    
    showStatus('✅ تم حفظ الملف محلياً: ' + currentFile.name + '\n💡 لحفظ في الموقع الفعلي، استخدم زر "تنزيل"', 'success');
    
    loadFiles(); // Refresh file list to show saved indicator
}

function clearLocalFile(filename) {
    if (confirm(`هل تريد حذف النسخة المحفوظة محلياً من: ${filename}؟\n\nسيتم استخدام الملف الأصلي.`)) {
        localStorage.removeItem('file_' + filename);
        localStorage.removeItem('file_' + filename + '_timestamp');
        showStatus('تم حذف النسخة المحلية', 'success');
        loadFiles();
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
    
    showStatus('✅ تم تنزيل الملف - قم برفعه إلى الموقع لتطبيق التغييرات', 'success');
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
        allImages = staticImages.map(img => ({
            name: img,
            url: img,
            size: 0
        }));
        
        displayImages(allImages);
        updateStats();
    } catch (error) {
        document.getElementById('imageGrid').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <p>❌ فشل تحميل الصور</p>
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
        html += `
            <div class="image-card" data-imagename="${img.name}">
                <img src="${img.url}" alt="${img.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Crect fill=%27%23334155%27 width=%27200%27 height=%27200%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%2394a3b8%27 font-size=%2714%27%3E${img.name}%3C/text%3E%3C/svg%3E'">
                <div class="image-info">
                    <div class="image-name">${img.name}</div>
                    <div class="image-actions">
                        <button class="btn btn-primary" onclick="viewImage('${img.url}')">👁️ عرض</button>
                        <button class="btn btn-success" onclick="copyImageUrl('${img.url}')">📋 نسخ الرابط</button>
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

function handleImageUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    
    showStatus(`⚠️ رفع الصور يتطلب خادم. قم بحفظ الصور وإضافتها يدوياً إلى المجلد`, 'info');
}

function viewImage(imageUrl) {
    window.open(imageUrl, '_blank');
}

function copyImageUrl(imageUrl) {
    const fullUrl = window.location.origin + '/' + imageUrl;
    navigator.clipboard.writeText(fullUrl).then(() => {
        showStatus('✅ تم نسخ رابط الصورة', 'success');
    }).catch(() => {
        showStatus('❌ فشل نسخ الرابط', 'error');
    });
}

function uploadImages() {
    showSection('images');
    showStatus('⚠️ رفع الصور يتطلب خادم أو رفع يدوي للملفات', 'info');
}

// New file creation
function createNewFile() {
    openModal('createFileModal');
}

async function submitNewFile(event) {
    event.preventDefault();
    const fileName = document.getElementById('newFileName').value;
    const fileType = document.getElementById('newFileType').value;
    
    const content = createTemplateContent(fileType);
    
    // Save to localStorage
    localStorage.setItem('file_' + fileName, content);
    localStorage.setItem('file_' + fileName + '_timestamp', new Date().toISOString());
    
    closeModal('createFileModal');
    showStatus('✅ تم إنشاء الملف محلياً: ' + fileName, 'success');
    
    document.getElementById('newFileName').value = '';
    
    // Add to static files list
    staticFiles.push({ name: fileName, type: fileType });
    
    await loadFiles();
    editFile(fileName, fileType);
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
        const hasLocalCopy = localStorage.getItem('file_' + page.name) !== null;
        html += `
            <div class="page-item">
                <div class="page-info">
                    <div class="page-name">${page.name} ${hasLocalCopy ? '💾' : ''}</div>
                    <div class="page-url">/${page.name}</div>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="editFile('${page.name}', 'html')">✏️ تحرير</button>
                    <button class="btn btn-success" onclick="viewFile('${page.name}')">👁️ عرض</button>
                </div>
            </div>
        `;
    });
    
    pageList.innerHTML = html;
}

// Configuration Management
async function saveConfig() {
    const siteName = document.getElementById('siteName').value;
    const mainPage = document.getElementById('mainPage').value;
    const siteTheme = document.getElementById('siteTheme').value;
    
    const config = {
        siteName,
        mainPage,
        theme: siteTheme,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('site_config', JSON.stringify(config));
    showStatus('✅ تم حفظ الإعدادات محلياً', 'success');
}

// Changelog Management
async function loadChangelog() {
    try {
        const savedFiles = Object.keys(localStorage)
            .filter(k => k.startsWith('file_') && !k.endsWith('_timestamp'))
            .map(k => {
                const filename = k.replace('file_', '');
                const timestamp = localStorage.getItem(k + '_timestamp');
                const content = localStorage.getItem(k);
                return {
                    filename,
                    timestamp: timestamp || new Date().toISOString(),
                    size: content ? content.length : 0
                };
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        displayChangelog(savedFiles);
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
                    📜 لا توجد نسخ محفوظة محلياً
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
                    <button class="btn btn-primary" onclick="editFile('${item.filename}', '${getFileType(item.filename)}')" style="padding: 5px 15px; font-size: 0.9em;">
                        ✏️ تحرير
                    </button>
                    <button class="btn btn-danger" onclick="clearLocalFile('${item.filename}')" style="padding: 5px 15px; font-size: 0.9em; margin-right: 5px;">
                        🗑️ حذف
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return ext;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function clearOldBackups() {
    if (confirm('هل تريد حذف جميع النسخ المحفوظة محلياً؟\n\nسيتم حذف جميع التعديلات غير المحفوظة في الموقع الفعلي.')) {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('file_'));
        keys.forEach(k => localStorage.removeItem(k));
        showStatus('✅ تم حذف جميع النسخ المحلية', 'success');
        loadChangelog();
        loadFiles();
        updateStats();
    }
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
        showStatus('⚠️ رفع الصور يتطلب خادم', 'info');
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
