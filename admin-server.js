/**
 * Admin Dashboard Backend Server
 * Provides real file operations for the admin dashboard
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

// Start server
app.listen(PORT, () => {
    console.log(`✅ Admin Dashboard Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🔐 Admin credentials:`);
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
});
