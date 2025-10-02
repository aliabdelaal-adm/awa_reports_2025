# ميزة جدول Excel الاحترافي | Professional Excel Table Feature

## 🎯 نظرة عامة | Overview

تم استبدال جدول التفتيش البسيط بجدول Excel احترافي متقدم يستمد بياناته من ملف `‎ plan-dataxlsx.json` ويعرضها بتنسيق احترافي يشبه Microsoft Excel.

The simple inspection table has been replaced with an advanced professional Excel table that derives its data from the `‎ plan-dataxlsx.json` file and displays it in a professional format similar to Microsoft Excel.

## ✨ المميزات | Features

### 1. تصميم احترافي | Professional Design
- **رؤوس متدرجة**: رؤوس الجدول بتدرج أزرق احترافي مع نص أبيض وظل
- **Gradient Headers**: Table headers with professional blue gradient, white text and shadow

### 2. تنسيق الخلايا الذكي | Smart Cell Formatting
- **ألوان صفوف متناوبة**: صفوف بيضاء وصفوف رمادية فاتحة للقراءة السهلة
- **Alternating Row Colors**: White and light gray rows for easy reading
- **العمود الأول مميز**: خلفية زرقاء فاتحة ونص غامق للعمود الأول
- **First Column Highlighted**: Light blue background and bold text for first column

### 3. تأثيرات تفاعلية | Interactive Effects
- **تأثير التحويم**: عند مرور الماوس، الصف يتوسع قليلاً ويظهر ظل
- **Hover Effect**: On mouse hover, rows scale slightly and show shadow
- **تحويل سلس**: انتقالات سلسة لجميع التأثيرات
- **Smooth Transitions**: Smooth transitions for all effects

### 4. دعم أوراق متعددة | Multiple Sheet Support
- عرض جميع أوراق ملف Excel بشكل منفصل
- Display all Excel sheets separately
- كل ورقة لها عنوان مميز بتدرج أزرق
- Each sheet has a distinctive blue gradient title

### 5. استجابة للطباعة | Print-Friendly
- تنسيق محسّن للطباعة وحفظ PDF
- Optimized formatting for printing and PDF saving

## 🎨 الأنماط المستخدمة | Styles Used

### Container Styles
```css
.excel-table-container {
  margin: 20px 0;
  overflow-x: auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  background: #fff;
}
```

### Sheet Title
```css
.excel-sheet-title {
  background: linear-gradient(135deg, #2336a0 0%, #1e2a8a 100%);
  color: #fff;
  padding: 12px 20px;
  font-size: 1.2em;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
  text-align: center;
}
```

### Table Headers
```css
.excel-header {
  padding: 14px 12px;
  text-align: center;
  color: #fff;
  font-weight: bold;
  background: linear-gradient(180deg, #2336a0 0%, #1e2a8a 100%);
  border: 1px solid #fff;
}
```

### Data Cells
```css
.excel-cell {
  padding: 10px 12px;
  text-align: center;
  border: 1px solid #d0d0d0;
  background: #fafafa;
  transition: background-color 0.2s, transform 0.1s;
}

.excel-cell-first {
  font-weight: bold;
  background: #e8f0fe;
  color: #2336a0;
}
```

### Hover Effects
```css
.excel-table tbody tr:hover .excel-cell {
  background: #e2e6f6;
  transform: scale(1.01);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
```

## 📋 الوظائف البرمجية | Functions

### 1. loadExcelTable()
تحميل ملف Excel وعرضه | Load Excel file and display it

```javascript
async function loadExcelTable() {
  // Check if XLSX library is loaded
  // Load Excel file from repository
  // Parse and render the table
}
```

### 2. renderExcelTable(workbook)
تحويل بيانات Excel إلى جدول HTML احترافي | Convert Excel data to professional HTML table

```javascript
function renderExcelTable(workbook) {
  // Process each sheet in the workbook
  // Create professional styled tables
  // Add headers and data rows
}
```

### 3. loadDemoExcelTable()
عرض جدول تجريبي لتوضيح التنسيق | Display demo table to showcase formatting

```javascript
function loadDemoExcelTable() {
  // Display sample inspection data
  // Show professional styling
  // Demonstrate hover effects
}
```

## 🔧 الاستخدام | Usage

### في حالة توفر مكتبة XLSX | When XLSX Library is Available
يتم تحميل الملف `‎ plan-dataxlsx.json` تلقائياً وعرض جميع الأوراق بتنسيق احترافي

The `‎ plan-dataxlsx.json` file is automatically loaded and all sheets are displayed in professional format

### في حالة عدم توفر المكتبة | When Library is Not Available
يظهر تنبيه للمستخدم بأن المكتبة غير محملة ويعرض جدول تجريبي بعد ثانيتين

A warning is shown to the user and a demo table is displayed after 2 seconds

## 📊 مثال على البيانات المعروضة | Data Display Example

### ورقة خطة التفتيش | Inspection Plan Sheet
- اسم المفتش | Inspector Name
- التاريخ | Date
- وقت المناوبة | Shift Time
- المنطقة | Area
- عدد المحلات | Number of Shops
- الحالة | Status

### ورقة إحصائيات المفتشين | Inspector Statistics Sheet
- اسم المفتش | Inspector Name
- عدد التفتيشات | Number of Inspections
- التفتيشات الصباحية | Morning Inspections
- التفتيشات المسائية | Evening Inspections
- معدل الإنجاز | Completion Rate

## 🎯 الأيقونات المستخدمة | Icons Used

- ✓ مكتمل | Completed
- ⏳ قيد التنفيذ | In Progress
- 📋 مجدول | Scheduled

## 🚀 التحسينات المستقبلية | Future Improvements

1. **تصدير إلى Excel**: إضافة زر لتصدير الجدول إلى ملف Excel
   - **Export to Excel**: Add button to export table to Excel file

2. **الفرز والترتيب**: إضافة إمكانية فرز الأعمدة
   - **Sort and Order**: Add column sorting capability

3. **التصفية**: إضافة مرشحات للبحث في البيانات
   - **Filtering**: Add filters to search data

4. **التحرير المباشر**: السماح بتحرير البيانات مباشرة في الجدول
   - **Inline Editing**: Allow direct data editing in table

5. **الإشعارات**: إضافة إشعارات عند تحديث البيانات
   - **Notifications**: Add notifications when data is updated

## 📝 ملاحظات | Notes

- الجدول متجاوب ويعمل على جميع أحجام الشاشات
- The table is responsive and works on all screen sizes

- التمرير الأفقي متاح للجداول الكبيرة
- Horizontal scrolling available for large tables

- التنسيق محسّن للطباعة وحفظ PDF
- Format optimized for printing and PDF saving

- يتم حفظ نمط الموقع (الأزرق الغامق) في جميع العناصر
- Site style (dark blue) maintained in all elements

## 🎨 لقطات شاشة | Screenshots

راجع ملف PR للحصول على لقطات شاشة توضح:
- الجدول الاحترافي الكامل
- تأثير التحويم على الصفوف
- عرض أوراق متعددة

See PR file for screenshots showing:
- Full professional table
- Row hover effect
- Multiple sheet display

## ⚙️ التكوين | Configuration

لتغيير مصدر ملف Excel، قم بتعديل السطر التالي في `loadExcelTable()`:

To change Excel file source, modify this line in `loadExcelTable()`:

```javascript
let res = await fetch('‎ plan-dataxlsx.json');
```

## 🔗 الروابط ذات الصلة | Related Links

- [مكتبة SheetJS](https://sheetjs.com/) - مكتبة قراءة ملفات Excel
- [دليل تنسيق Excel](EXCEL_FORMAT_GUIDE.md) - دليل تنسيق الملفات

---

**تم التطوير بواسطة | Developed by**: د. علي عبدالعال | Dr. Ali Abdelaal
**التاريخ | Date**: يناير 2025 | January 2025
