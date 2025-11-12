# How to Upload the Transit Screen Saver Video

## Quick Start

To complete the setup and display the transit screen saver video on https://aliabdelaal-adm.github.io/awa_reports_2025/, follow these steps:

### 1. Prepare Your Video File

Ensure your video file is named **exactly**:
```
transit screen saver video.mp4
```

> ⚠️ **Important**: The filename must match exactly, including spaces and capitalization.

### 2. Upload to Repository

#### Option A: Using GitHub Web Interface
1. Go to https://github.com/aliabdelaal-adm/awa_reports_2025
2. Click "Add file" > "Upload files"
3. Drag and drop `transit screen saver video.mp4`
4. Add commit message: "Add transit screen saver video"
5. Click "Commit changes"

#### Option B: Using Git Command Line
```bash
# Navigate to your local repository
cd awa_reports_2025

# Copy your video file to the repository root
cp /path/to/your/transit\ screen\ saver\ video.mp4 .

# Add the file to git
git add "transit screen saver video.mp4"

# Commit the change
git commit -m "Add transit screen saver video"

# Push to GitHub
git push origin main
```

#### Option C: Using GitHub Desktop
1. Open GitHub Desktop
2. Select the awa_reports_2025 repository
3. Copy `transit screen saver video.mp4` to the repository folder
4. The file will appear in GitHub Desktop's changes list
5. Add commit message: "Add transit screen saver video"
6. Click "Commit to main"
7. Click "Push origin"

### 3. Wait for GitHub Pages to Update

After pushing the video file:
- GitHub Pages will automatically rebuild (takes 1-5 minutes)
- Visit https://aliabdelaal-adm.github.io/awa_reports_2025/ to see the video

### 4. Verify the Video is Working

1. Open https://aliabdelaal-adm.github.io/awa_reports_2025/
2. You should see the video playing automatically in fullscreen
3. Move your mouse to see the video controls
4. The Abu Dhabi Municipality logo should appear in the top-right corner

## Video Specifications

### Recommended Settings
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD) or higher
- **Aspect Ratio**: 16:9
- **Frame Rate**: 24-30 fps
- **Bitrate**: 5-10 Mbps
- **Audio**: Optional (video will be muted by default)

### File Size Considerations
- **Optimal**: < 50 MB for fast loading
- **Maximum**: < 100 MB (GitHub file size limit is 100 MB)
- If your video is larger than 100 MB, you'll need to:
  - Compress the video
  - Reduce resolution
  - Or use Git LFS (Large File Storage)

### Using Git LFS for Large Files
If your video file is larger than 100 MB:

```bash
# Install Git LFS
git lfs install

# Track MP4 files
git lfs track "*.mp4"

# Add .gitattributes
git add .gitattributes

# Add and commit your video
git add "transit screen saver video.mp4"
git commit -m "Add transit screen saver video via Git LFS"
git push origin main
```

## Troubleshooting

### Video Doesn't Show Up
1. **Check filename**: Must be exactly `transit screen saver video.mp4`
2. **Check location**: Must be in repository root, not in a subfolder
3. **Clear browser cache**: Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
4. **Wait**: GitHub Pages can take up to 5 minutes to update

### Video is Too Large
1. Use a video compression tool:
   - HandBrake (free, cross-platform)
   - Adobe Media Encoder
   - FFmpeg command line
2. Example FFmpeg command to compress:
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -crf 23 "transit screen saver video.mp4"
   ```

### Placeholder Message Shows
If you see the message "لعرض الفيديو، يرجى رفع الملف":
- The video file is not found or not loaded yet
- Check that the file is uploaded to the correct location
- Verify the filename matches exactly

## Testing Locally

Before uploading, you can test the video locally:

1. Place `transit screen saver video.mp4` in the repository root
2. Open `index.html` in your browser
3. The video should play automatically

## Additional Features

### Access the Dashboard
- Click the "📊 لوحة التقارير" button (bottom-right)
- Or navigate directly to: https://aliabdelaal-adm.github.io/awa_reports_2025/index-dashboard.html

### Video Controls
- **Play/Pause**: Click ▶️/⏸️ or press Space bar
- **Mute/Unmute**: Click 🔊/🔇
- **Fullscreen**: Click ⛶
- Controls appear on mouse movement and hide after 3 seconds

## Support

For technical assistance, contact:
- **Developer**: د. علي عبدالعال
- **Department**: إدارة الرفق بالحيوان - بلدية مدينة أبوظبي

## References

- Full documentation: See `TRANSIT_VIDEO_README.md`
- Original dashboard: Accessible at `index-dashboard.html`
