# دليل وضع العرض (Viewer Mode Guide)

## نظرة عامة | Overview

تم إضافة ميزة "وضع العرض" (Viewer Mode) إلى نظام التقارير للسماح بعرض التقارير للمشاهدين دون إظهار أزرار التنقل أو أدوات التصدير.

The "Viewer Mode" feature has been added to the reports system to allow displaying reports to viewers without showing navigation buttons or export tools.

---

## كيفية الاستخدام | How to Use

### الوضع العادي | Normal Mode
عند فتح التقرير بشكل عادي، سيتم عرض جميع العناصر:
- أزرار التنقل بين الصفحات (الصفحة الرئيسية، التقارير الأخرى)
- أزرار التنقل بين الأقسام (الإحصائيات، التحليلات، إلخ)
- أزرار التصدير (PDF, Excel, PowerPoint)

```
https://example.com/index.html
```

When opening the report normally, all elements will be displayed:
- Navigation buttons between pages (Home page, Other reports)
- Navigation buttons between sections (Statistics, Analytics, etc.)
- Export buttons (PDF, Excel, PowerPoint)

---

### وضع العرض | Viewer Mode
عند فتح التقرير في وضع العرض، سيتم إخفاء جميع عناصر التنقل والتصدير، مع عرض محتوى التقرير فقط.

When opening the report in viewer mode, all navigation and export elements will be hidden, showing only the report content.

#### طرق التفعيل | Activation Methods

**الطريقة 1:** إضافة معامل `view` إلى الرابط
```
https://example.com/index.html?view=true
```

**الطريقة 2:** إضافة معامل `viewer` إلى الرابط
```
https://example.com/index.html?viewer=1
```

---

## العناصر المخفية في وضع العرض | Hidden Elements in Viewer Mode

### 1. شريط التبديل بين الصفحات | Page Switcher Bar
- زر الصفحة الرئيسية (🏠)
- زر التقرير الاحترافي (📊)
- زر لوحة التحكم (🎛️)

### 2. أزرار التنقل | Navigation Buttons
- لوحة التحكم التحليلية
- التحليلات المتقدمة
- التقارير الشهرية
- التحديات
- الحلول والإجراءات
- التوصيات
- مقترحات التطوير
- جميع البيانات

### 3. أزرار التصدير | Export Buttons
- تصدير PDF
- تصدير Excel
- تصدير PowerPoint

---

## أمثلة عملية | Practical Examples

### مثال 1: مشاركة رابط للعرض فقط
```html
<!-- رابط للمشاهدة فقط بدون إمكانية التنقل -->
<a href="index.html?view=true">عرض الخطة التحسينية</a>
```

### مثال 2: تضمين في إطار (iframe)
```html
<!-- تضمين التقرير في صفحة أخرى -->
<iframe src="index.html?viewer=1" width="100%" height="600px"></iframe>
```

### مثال 3: عرض تقديمي
```
<!-- استخدم هذا الرابط للعروض التقديمية -->
index.html?view=true
```

---

## ملاحظات مهمة | Important Notes

### 🔒 الأمان | Security
- وضع العرض يعمل على جانب العميل (Client-side) ويمكن تجاوزه من خلال أدوات المطور
- للأمان الكامل، يُنصح بتطبيق التحكم بالوصول على جانب الخادم (Server-side)
- هذه الميزة مناسبة للعروض التقديمية والمشاركة العامة، وليست للأمان الحقيقي

Viewer mode works on the client-side and can be bypassed through developer tools. For full security, implement server-side access control. This feature is suitable for presentations and public sharing, not for real security.

### ✅ التوافق | Compatibility
- يعمل في جميع المتصفحات الحديثة (Chrome, Firefox, Safari, Edge)
- لا يتطلب أي إعدادات خاصة
- متوافق مع جميع الأجهزة (Desktop, Tablet, Mobile)

Works in all modern browsers (Chrome, Firefox, Safari, Edge). No special settings required. Compatible with all devices (Desktop, Tablet, Mobile).

### 📱 الاستخدام على الأجهزة المحمولة | Mobile Usage
- وضع العرض مثالي للعرض على الشاشات الكبيرة أو الأجهزة المحمولة
- يوفر تجربة مشاهدة نظيفة بدون تشتيت

Viewer mode is ideal for displaying on large screens or mobile devices. Provides a clean viewing experience without distractions.

---

## استكشاف الأخطاء | Troubleshooting

### المشكلة: لا تزال العناصر ظاهرة | Problem: Elements still visible
**الحل:** تأكد من إضافة `?view=true` أو `?viewer=1` في نهاية الرابط

**Solution:** Make sure to add `?view=true` or `?viewer=1` at the end of the URL

### المشكلة: الصفحة فارغة | Problem: Empty page
**الحل:** تحقق من أن ملف `index.html` موجود وأن الرابط صحيح

**Solution:** Check that `index.html` exists and the link is correct

---

## للمطورين | For Developers

### التخصيص | Customization
يمكن تخصيص العناصر المخفية من خلال تعديل دالة `updateLinkVisibility()` في ملف `index.html`:

You can customize the hidden elements by modifying the `updateLinkVisibility()` function in `index.html`:

```javascript
function updateLinkVisibility() {
    // ... existing code ...
    
    if (isViewerMode) {
        // إضافة عناصر أخرى للإخفاء
        // Add more elements to hide
        const myElement = document.querySelector('.my-custom-element');
        if (myElement) {
            myElement.style.display = 'none';
        }
    }
}
```

### الكشف عن وضع العرض | Detecting Viewer Mode
```javascript
const urlParams = new URLSearchParams(window.location.search);
const isViewerMode = urlParams.has('view') || urlParams.has('viewer');

if (isViewerMode) {
    console.log('في وضع العرض | In Viewer Mode');
} else {
    console.log('في الوضع العادي | In Normal Mode');
}
```

---

## الدعم | Support

للمساعدة أو الأسئلة، يرجى التواصل مع:

For help or questions, please contact:

**د. علي عبدالعال | Dr. Ali Abdelaal**
- البريد الإلكتروني | Email: ali.abdelaal@adm.gov.ae
- الهاتف | Phone: 0581187777

---

**تم التطوير بواسطة:** د. علي عبدالعال  
**إدارة:** الرقابة والرفق بالحيوان  
**الجهة:** بلدية مدينة أبوظبي

**Developed by:** Dr. Ali Abdelaal  
**Department:** Animal Welfare and Control  
**Organization:** Abu Dhabi City Municipality
