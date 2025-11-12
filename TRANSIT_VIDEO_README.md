# Transit Screen Saver Video - Setup Guide

## Overview
The main GitHub Pages URL (https://aliabdelaal-adm.github.io/awa_reports_2025/) now displays a fullscreen transit screen saver video for Abu Dhabi Municipality.

## How to Add the Video

### Step 1: Prepare the Video File
1. Ensure your video file is named exactly: `transit screen saver video.mp4`
2. For best performance, optimize the video:
   - Recommended format: MP4 (H.264 codec)
   - Recommended resolution: 1920x1080 or higher
   - Recommended bitrate: 5-10 Mbps

### Step 2: Upload the Video
Upload the video file to the root directory of this repository:
```
awa_reports_2025/
├── index.html
├── transit screen saver video.mp4  ← Place video file here
├── index-dashboard.html
└── ... other files
```

### Step 3: Commit and Push
```bash
git add "transit screen saver video.mp4"
git commit -m "Add transit screen saver video"
git push
```

## Features

### Video Player
- **Autoplay**: Video starts playing automatically when the page loads
- **Loop**: Video loops continuously for screen saver effect
- **Muted by default**: Starts muted to comply with browser autoplay policies
- **Fullscreen support**: Can be viewed in fullscreen mode

### Controls
The video player includes the following controls that appear on mouse movement:
- ▶️/⏸️ **Play/Pause**: Toggle video playback
- 🔊/🔇 **Mute/Unmute**: Toggle audio
- ⛶ **Fullscreen**: Enter/exit fullscreen mode

Keyboard shortcuts:
- **Space bar**: Play/Pause video

### Additional Elements
- **Logo Overlay**: Abu Dhabi Municipality branding in the top-right corner
- **Dashboard Button**: Link to the reports dashboard (bottom-right)
- **Placeholder Message**: Shown if video file is not found

## File Structure Changes

### Modified Files
- `index.html` → Now displays the transit screen saver video
- `index-dashboard.html` → Backup of the original dashboard (renamed from index.html)

### Access Points
- **Main URL** (https://aliabdelaal-adm.github.io/awa_reports_2025/) → Transit video
- **Dashboard** → Click the "📊 لوحة التقارير" button or navigate to `index-dashboard.html`

## Technical Details

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support (with autoplay limitations)

### Mobile Considerations
- Video will autoplay on mobile only if muted
- Touch the screen to show controls
- Controls automatically hide after 3 seconds of inactivity

### Troubleshooting

**Video doesn't play:**
1. Ensure the file is named exactly: `transit screen saver video.mp4`
2. Check that the file is in the root directory
3. Clear browser cache and reload
4. Check browser console for errors

**Video quality issues:**
1. Ensure video is properly encoded
2. Use H.264 codec for best compatibility
3. Consider reducing file size if loading is slow

**Controls don't appear:**
- Move the mouse or touch the screen
- Controls appear automatically and hide after 3 seconds

## Development Notes

### Video Element Configuration
```html
<video id="screenSaverVideo" autoplay loop muted playsinline>
    <source src="transit screen saver video.mp4" type="video/mp4">
</video>
```

### Styling
- Fullscreen black background
- Video uses `object-fit: contain` to maintain aspect ratio
- Responsive design for all screen sizes

## Support
For issues or questions, contact the development team.

**Developer**: د. علي عبدالعال  
**Department**: إدارة الرفق بالحيوان - بلدية مدينة أبوظبي
