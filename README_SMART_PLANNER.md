# Smart Planner Control System

## Overview

The **Smart Planner** is a professional 100% content management system that provides complete and intelligent control over the visibility of report files on the website. Developed specifically for the Public Health Department - Animal Welfare and Control Division.

## Key Features

### 🎛️ Full Control Panel
- **File Visibility Management**: Toggle individual files on/off
- **Batch Operations**: Show/hide all files at once
- **Real-time Statistics**: Live dashboard with file counts
- **Activity Logging**: Complete audit trail of all changes

### 🔒 Security Features
- **Password Protection**: Secure login system (default: `Ali@2025`)
- **Access Control**: Hidden files redirect to home page
- **Activity Tracking**: All actions logged with timestamps
- **Local Storage**: Settings stored securely in browser

### 📊 Smart Dashboard
- **File Cards**: Each file with toggle switch, preview, and copy link
- **Statistics Panel**: Total, visible, and hidden file counts
- **Last Update Tracker**: Timestamp of latest configuration change
- **Activity Log**: Recent 50 actions displayed

### ⚙️ Advanced Features
- **Export Settings**: Backup configuration to JSON file
- **Import Settings**: Restore configuration from JSON file
- **Reset to Default**: One-click restore to initial state
- **Analytics View**: Detailed report of system status

## File Structure

### Main Files
1. **smart-planner.html** - Control panel (password-protected)
2. **home.html** - Landing page (dynamic file display)
3. **index.html** - Improvement Plan Report (hidden by default)
4. **index2.html** - Training Report (visible by default)
5. **developer-panel_Version4.html** - Developer Panel (visible by default)

## Default Configuration

| File | Status | Visibility |
|------|--------|-----------|
| Improvement Plan (index.html) | ❌ Hidden | Not shown on home page |
| Training Report (index2.html) | ✅ Visible | Shown on home page |
| Developer Panel | ✅ Visible | Shown on home page |
| Smart Planner | Always Visible | Always shown (pink card) |

## Quick Start

1. Open `home.html` in your browser
2. Navigate to Smart Planner (pink card)
3. Login with:
   - Username: `admin`
   - Password: `Ali@2025`
4. Toggle file visibility as needed
5. Changes are saved automatically

## How It Works

### Visibility Control
The system uses `localStorage` to store visibility settings:

```javascript
{
  "index": false,      // Hidden
  "index2": true,      // Visible
  "developer-panel": true,
  "lastUpdate": "2025-11-01T07:51:09.123Z"
}
```

### File Protection
Hidden files check visibility on load:

```javascript
if (!isFileVisible()) {
    if (!document.referrer.includes('smart-planner.html')) {
        window.location.href = 'home.html';
    }
}
```

### Dynamic Home Page
The home page reads settings and displays only visible files:

```javascript
if (isFileVisible(file.id)) {
    // Display file card
}
```

## Screenshots

### Home Page (Default - 1 file hidden)
![Home Page](https://github.com/user-attachments/assets/08523379-a2e9-43c3-88fc-a5e5b73bc6fb)

### Smart Planner Dashboard
![Smart Planner](https://github.com/user-attachments/assets/cb4dc524-f55d-4102-a4d0-ace9e0306e8c)

### Home Page (All files visible)
![All Visible](https://github.com/user-attachments/assets/ba302cfa-0600-4488-8cd5-e8e34a30791c)

## Technical Details

### Technologies Used
- **HTML5**: Modern semantic markup
- **CSS3**: Gradients, animations, responsive design
- **JavaScript**: Vanilla JS (no dependencies)
- **localStorage**: Client-side data persistence

### Browser Support
- ✅ Chrome / Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Responsive Design
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (375px+)

## Configuration

### Change Password
Edit `smart-planner.html`:
```javascript
const DEFAULT_PASSWORD = "Ali@2025"; // Change this
```

### Add New File
Add to `files` array in both `smart-planner.html` and `home.html`:
```javascript
{
    id: "new-file",
    name: "File Name",
    description: "File description",
    path: "path/to/file.html",
    icon: "📄",
    defaultVisible: true
}
```

## Troubleshooting

### Changes not appearing
1. Clear browser cache (Ctrl+Shift+Delete)
2. Reload page (F5)

### Forgot password
1. Open browser console (F12)
2. Run: `localStorage.removeItem('smartPlannerAuth')`
3. Reload page

### Reset everything
1. Open browser console
2. Run: `localStorage.clear()`
3. Reload page

## Best Practices

### For Developers
1. ✅ Export settings before major changes
2. ✅ Test on local server first
3. ✅ Monitor activity log regularly
4. ✅ Change default password

### For Users
1. ✅ Use home page for navigation
2. ✅ Avoid direct file access
3. ✅ Report issues to developer

## API Reference

### Configuration Storage
- **Key**: `smartPlannerConfig`
- **Format**: JSON object
- **Location**: localStorage

### Activity Log Storage
- **Key**: `smartPlannerActivityLog`
- **Format**: JSON array
- **Max Items**: 100

### Functions

#### `getConfig()`
Returns current configuration object

#### `saveConfig(config)`
Saves configuration to localStorage

#### `isFileVisible(fileId)`
Returns boolean indicating file visibility

#### `toggleFile(fileId, isVisible)`
Updates file visibility and refreshes UI

## Performance

- **Load Time**: < 1 second
- **Storage Usage**: < 10KB
- **Memory Usage**: Minimal (client-side only)
- **No Server Required**: Fully static

## Future Enhancements

Potential improvements:
- [ ] Multi-user support with roles
- [ ] Scheduled visibility changes
- [ ] Email notifications on changes
- [ ] Cloud backup integration
- [ ] Mobile app version

## Credits

**Developer**: Dr. Ali Abdelaal  
**Email**: ali.abdelaal@adm.gov.ae  
**Phone**: 0581187777  

**Organization**: Abu Dhabi City Municipality  
**Department**: Public Health - Animal Welfare & Control  

## License

© 2025 All Rights Reserved  
Developed for Abu Dhabi City Municipality

## Version History

- **v1.0.0** (2025-11-01): Initial release
  - Password-protected control panel
  - File visibility management
  - Activity logging
  - Export/Import settings
  - Responsive design
  - Home page integration

## Support

For issues or questions:
- 📧 Email: ali.abdelaal@adm.gov.ae
- 📱 Phone: 0581187777

---

**Made with ❤️ by Dr. Ali Abdelaal**
