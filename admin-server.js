/**
 * Admin Dashboard Backend Server
 * Provides real file operations for the admin dashboard with GitHub integration
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Security: Simple authentication middleware
// Developer credentials
const ADMIN_USERNAME = 'developer';
const ADMIN_PASSWORD = '1940';

const authenticate = (req, res, next) => {
    const username = req.headers['x-admin-username'];
    const password = req.headers['x-admin-password'];
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Get list of all HTML, CSS, and JS files
app.get('/api/files', authenticate, (req, res) => {
    try {
        const files = fs.readdirSync(__dirname);
        const editableFiles = files.filter(file => {
            const ext = path.extname(file);
            return ['.html', '.css', '.js', '.json', '.md'].includes(ext);
        }).map(file => {
            const stats = fs.statSync(path.join(__dirname, file));
            return {
                name: file,
                path: file,
                size: stats.size,
                modified: stats.mtime,
                type: path.extname(file).substring(1)
            };
        });
        res.json(editableFiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get content of a specific file
app.get('/api/files/:filename', authenticate, (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, filename);
        
        // Security check: prevent directory traversal
        if (!filepath.startsWith(__dirname)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        const content = fs.readFileSync(filepath, 'utf8');
        res.json({ content, filename });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save/update a file
app.post('/api/files/:filename', authenticate, (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, filename);
        const { content } = req.body;
        
        // Security check: prevent directory traversal
        if (!filepath.startsWith(__dirname)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // Create backup before saving
        if (fs.existsSync(filepath)) {
            const backupDir = path.join(__dirname, 'backups');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir);
            }
            const backupPath = path.join(backupDir, `${filename}.${Date.now()}.bak`);
            fs.copyFileSync(filepath, backupPath);
        }
        
        fs.writeFileSync(filepath, content, 'utf8');
        res.json({ success: true, message: 'File saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new file
app.post('/api/files', authenticate, (req, res) => {
    try {
        const { filename, content } = req.body;
        const filepath = path.join(__dirname, filename);
        
        // Security check: prevent directory traversal
        if (!filepath.startsWith(__dirname)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        if (fs.existsSync(filepath)) {
            return res.status(409).json({ error: 'File already exists' });
        }
        
        fs.writeFileSync(filepath, content || '', 'utf8');
        res.json({ success: true, message: 'File created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a file
app.delete('/api/files/:filename', authenticate, (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, filename);
        
        // Security check: prevent directory traversal
        if (!filepath.startsWith(__dirname)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // Don't delete critical files
        const criticalFiles = ['admin-dashboard.html', 'admin-server.js', 'package.json'];
        if (criticalFiles.includes(filename)) {
            return res.status(403).json({ error: 'Cannot delete critical file' });
        }
        
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Move to trash instead of permanent delete
        const trashDir = path.join(__dirname, 'trash');
        if (!fs.existsSync(trashDir)) {
            fs.mkdirSync(trashDir);
        }
        const trashPath = path.join(trashDir, `${filename}.${Date.now()}`);
        fs.renameSync(filepath, trashPath);
        
        res.json({ success: true, message: 'File moved to trash' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get list of images
app.get('/api/images', authenticate, (req, res) => {
    try {
        const files = fs.readdirSync(__dirname);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
        }).map(file => {
            const stats = fs.statSync(path.join(__dirname, file));
            return {
                name: file,
                path: file,
                size: stats.size,
                modified: stats.mtime,
                url: `/${file}`
            };
        });
        res.json(imageFiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload images
app.post('/api/images', authenticate, upload.array('images', 10), (req, res) => {
    try {
        const uploadedFiles = req.files.map(file => ({
            name: file.filename,
            size: file.size,
            path: file.filename
        }));
        res.json({ success: true, files: uploadedFiles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an image
app.delete('/api/images/:filename', authenticate, (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, filename);
        
        // Security check: prevent directory traversal
        if (!filepath.startsWith(__dirname)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Move to trash instead of permanent delete
        const trashDir = path.join(__dirname, 'trash');
        if (!fs.existsSync(trashDir)) {
            fs.mkdirSync(trashDir);
        }
        const trashPath = path.join(trashDir, `${filename}.${Date.now()}`);
        fs.renameSync(filepath, trashPath);
        
        res.json({ success: true, message: 'Image moved to trash' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get site configuration
app.get('/api/config', authenticate, (req, res) => {
    try {
        const configPath = path.join(__dirname, 'site-config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            res.json(config);
        } else {
            res.json({
                siteName: 'نظام التقارير - إدارة الصحة العامة',
                mainPages: ['home.html', 'index.html'],
                theme: 'default'
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update site configuration
app.post('/api/config', authenticate, (req, res) => {
    try {
        const configPath = path.join(__dirname, 'site-config.json');
        fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2), 'utf8');
        res.json({ success: true, message: 'Configuration updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get change log
app.get('/api/changelog', authenticate, (req, res) => {
    try {
        const backupDir = path.join(__dirname, 'backups');
        if (!fs.existsSync(backupDir)) {
            return res.json([]);
        }
        
        const backups = fs.readdirSync(backupDir).map(file => {
            const stats = fs.statSync(path.join(backupDir, file));
            return {
                filename: file,
                timestamp: stats.mtime,
                size: stats.size
            };
        }).sort((a, b) => b.timestamp - a.timestamp);
        
        res.json(backups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Restore from backup
app.post('/api/restore/:backupFile', authenticate, (req, res) => {
    try {
        const backupFile = req.params.backupFile;
        const backupPath = path.join(__dirname, 'backups', backupFile);
        
        if (!fs.existsSync(backupPath)) {
            return res.status(404).json({ error: 'Backup file not found' });
        }
        
        // Extract original filename from backup
        const originalFilename = backupFile.split('.')[0] + '.' + backupFile.split('.')[1];
        const targetPath = path.join(__dirname, originalFilename);
        
        fs.copyFileSync(backupPath, targetPath);
        res.json({ success: true, message: 'File restored successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Admin server is running' });
});

// Initialize git
const git = simpleGit(__dirname);

// Git: Check status
app.get('/api/git/status', authenticate, async (req, res) => {
    try {
        const status = await git.status();
        res.json({
            current: status.current,
            tracking: status.tracking,
            modified: status.modified,
            created: status.created,
            deleted: status.deleted,
            renamed: status.renamed,
            files: status.files
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Git: Commit changes
app.post('/api/git/commit', authenticate, async (req, res) => {
    try {
        const { message, files } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Commit message is required' });
        }
        
        // Add specific files or all if not specified
        if (files && files.length > 0) {
            await git.add(files);
        } else {
            await git.add('.');
        }
        
        const result = await git.commit(message);
        res.json({
            success: true,
            commit: result.commit,
            summary: result.summary
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Git: Push to GitHub
app.post('/api/git/push', authenticate, async (req, res) => {
    try {
        const { remote, branch } = req.body;
        
        const result = await git.push(remote || 'origin', branch || 'main');
        res.json({
            success: true,
            message: 'Changes pushed to GitHub successfully',
            result
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            hint: 'Make sure Git credentials are configured and you have push access'
        });
    }
});

// Git: Pull from GitHub
app.post('/api/git/pull', authenticate, async (req, res) => {
    try {
        const { remote, branch } = req.body;
        
        const result = await git.pull(remote || 'origin', branch || 'main');
        res.json({
            success: true,
            message: 'Changes pulled from GitHub successfully',
            result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Git: Commit and push in one operation
app.post('/api/git/save', authenticate, async (req, res) => {
    try {
        const { message, files } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Commit message is required' });
        }
        
        // Add files
        if (files && files.length > 0) {
            await git.add(files);
        } else {
            await git.add('.');
        }
        
        // Commit
        const commitResult = await git.commit(message);
        
        // Push
        const pushResult = await git.push('origin', 'main');
        
        res.json({
            success: true,
            message: 'Changes saved and pushed to GitHub successfully',
            commit: commitResult.commit,
            summary: commitResult.summary
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            hint: 'Make sure Git credentials are configured and you have push access'
        });
    }
});

// Get all reports and campaigns data
app.get('/api/content/all', authenticate, (req, res) => {
    try {
        // Parse home.html to get files array
        const homeHtml = fs.readFileSync(path.join(__dirname, 'home.html'), 'utf8');
        
        // Extract JavaScript files array from home.html
        const filesMatch = homeHtml.match(/const files = \[([\s\S]*?)\];/);
        const campaignFilesMatch = homeHtml.match(/const campaignFiles = \[([\s\S]*?)\];/);
        const specialViewsMatch = homeHtml.match(/const specialViews = \[([\s\S]*?)\];/);
        
        let files = [];
        let campaignFiles = [];
        let specialViews = [];
        
        if (filesMatch) {
            try {
                files = eval('[' + filesMatch[1] + ']');
            } catch (e) {
                console.error('Error parsing files:', e);
            }
        }
        
        if (campaignFilesMatch) {
            try {
                campaignFiles = eval('[' + campaignFilesMatch[1] + ']');
            } catch (e) {
                console.error('Error parsing campaignFiles:', e);
            }
        }
        
        if (specialViewsMatch) {
            try {
                specialViews = eval('[' + specialViewsMatch[1] + ']');
            } catch (e) {
                console.error('Error parsing specialViews:', e);
            }
        }
        
        res.json({
            files,
            campaignFiles,
            specialViews,
            pages: {
                home: 'home.html',
                gallery: 'gallery-view.html',
                index: 'index.html',
                index2: 'index2.html'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update report/campaign data
app.post('/api/content/update', authenticate, (req, res) => {
    try {
        const { page, dataType, data } = req.body;
        
        if (!page || !dataType || !data) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const filepath = path.join(__dirname, page);
        
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'Page not found' });
        }
        
        // Create backup
        const backupDir = path.join(__dirname, 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }
        const backupPath = path.join(backupDir, `${page}.${Date.now()}.bak`);
        fs.copyFileSync(filepath, backupPath);
        
        // Read current file
        let content = fs.readFileSync(filepath, 'utf8');
        
        // Replace the data array in the file
        const dataString = JSON.stringify(data, null, 12).replace(/^/gm, '        ');
        const regex = new RegExp(`const ${dataType} = \\[[\\s\\S]*?\\];`, 'm');
        content = content.replace(regex, `const ${dataType} = ${dataString};`);
        
        // Write back
        fs.writeFileSync(filepath, content, 'utf8');
        
        res.json({ success: true, message: `${dataType} updated successfully in ${page}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Admin Dashboard Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🔐 Admin credentials:`);
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`🔄 GitHub integration enabled`);
});
