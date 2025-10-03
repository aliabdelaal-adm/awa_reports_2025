# تعليمات إعداد الملف الصوتي للشاشة الترحيبية
# Audio Setup Instructions for Welcome Screen

## النسخة العربية

### الخطوات المطلوبة:

1. **تحميل الصوت من يوتيوب**
   - افتح الفيديو: https://www.youtube.com/watch?v=HKP4i6gePWw
   - استخدم أحد المواقع لتحميل الصوت من يوتيوب (مثل: y2mate.com, ytmp3.cc, أو أي أداة أخرى)
   - حمل الصوت بصيغة MP3

2. **تحرير الملف الصوتي (اختياري)**
   - إذا كنت تريد قص الصوت إلى 10 ثواني فقط، استخدم أي برنامج تحرير صوت مثل:
     - Audacity (مجاني)
     - Online Audio Cutter
     - أي برنامج تحرير صوت آخر
   - اقتطع الجزء المطلوب من الخطاب (10 ثواني)

3. **رفع الملف**
   - احفظ الملف باسم: `sheikh-zayed-speech.mp3`
   - ضع الملف في نفس المجلد مع ملف `index.html`

4. **التأكد من الإعداد**
   - افتح ملف `index.html` في المتصفح
   - يجب أن يبدأ الصوت تلقائياً عند فتح الصفحة
   - ستغلق الشاشة الترحيبية تلقائياً بعد 10 ثواني

---

## English Version

### Required Steps:

1. **Download Audio from YouTube**
   - Open the video: https://www.youtube.com/watch?v=HKP4i6gePWw
   - Use one of the websites to download audio from YouTube (e.g., y2mate.com, ytmp3.cc, or any other tool)
   - Download the audio in MP3 format

2. **Edit the Audio File (Optional)**
   - If you want to trim the audio to just 10 seconds, use any audio editing software such as:
     - Audacity (free)
     - Online Audio Cutter
     - Any other audio editing program
   - Cut the desired part of the speech (10 seconds)

3. **Upload the File**
   - Save the file as: `sheikh-zayed-speech.mp3`
   - Place the file in the same folder as `index.html`

4. **Verify Setup**
   - Open the `index.html` file in your browser
   - The audio should start automatically when the page opens
   - The welcome screen will automatically close after 10 seconds

---

## ملاحظات تقنية / Technical Notes

### Autoplay Policy
- Most modern browsers (Chrome, Firefox, Safari) have restrictions on autoplay
- Audio may not play automatically on first visit without user interaction
- After the first click, autoplay should work consistently

### Supported Audio Formats
- MP3 (recommended - widely supported)
- OGG (alternative)
- WAV (larger file size)

### File Size Optimization
- For a 10-second audio clip, the file should be around 100-200 KB
- Use a bitrate of 128 kbps for good quality and small size

---

## استكشاف الأخطاء / Troubleshooting

### الصوت لا يعمل تلقائياً
- قد تمنع بعض المتصفحات التشغيل التلقائي
- انقر في أي مكان على الشاشة وأعد تحميل الصفحة
- تأكد من أن ملف الصوت موجود في المسار الصحيح

### Audio Doesn't Play Automatically
- Some browsers may prevent autoplay
- Click anywhere on the screen and reload the page
- Make sure the audio file exists in the correct path

### تنسيق الملف غير مدعوم
- تأكد من أن الملف بصيغة MP3
- جرب إعادة تحويل الملف باستخدام أداة أخرى

### File Format Not Supported
- Make sure the file is in MP3 format
- Try re-converting the file using a different tool
