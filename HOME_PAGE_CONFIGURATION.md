# Home Page Configuration Guide

## Overview
This document explains how the home page (`home.html`) file visibility is configured and managed.

## Current Configuration

As of the latest update, the home page displays **only ONE file** by default:

### Visible File
✅ **تقرير التوعية الاحترافي** (Professional Awareness Report)
- File: `index2.html`
- Icon: 📊
- Description: تقرير تفصيلي عن برنامج التوعية والتدريب لموظفي محلات بيع الحيوانات الأليفة مع معرض الصور

### Hidden Files (by default)
❌ **الخطة التحسينية المستمرة** (Continuous Improvement Plan)
- File: `index.html`
- Can be enabled through Smart Planner

❌ **تقرير حملات التوعية والتوجيه والإرشاد الموحد** (Unified Awareness Campaign Report)
- File: `awareness-campaign-report.html`
- Can be enabled through Smart Planner

❌ **لوحة المطور** (Developer Panel)
- File: `developer-panel_Version4.html`
- Can be enabled through Smart Planner

## How to Change File Visibility

Developers can control which files are displayed on the home page using the **Smart Planner** control panel:

1. Navigate to `smart-planner.html`
2. Login with developer credentials
3. Toggle file visibility using the control switches
4. Changes are saved automatically in browser's localStorage

## Technical Implementation

File visibility is controlled by the `defaultVisible` property in the `files` array:

```javascript
const files = [
    {
        id: "index2",
        name: "تقرير التوعية الاحترافي",
        defaultVisible: true,  // This file will be shown
        // ... other properties
    },
    {
        id: "awareness-campaign",
        name: "تقرير حملات التوعية",
        defaultVisible: false, // This file will be hidden
        // ... other properties
    }
];
```

## Configuration Files

Both files must be kept in sync:
- `home.html` - Main landing page
- `smart-planner.html` - Developer control panel

## Developer Notes

- The default configuration shows only ONE file to keep the home page focused and clean
- Developers can override defaults using the Smart Planner interface
- User preferences are stored in localStorage with key: `smartPlannerConfig`
- The admin card is only visible to authenticated developers

---

**Last Updated:** 2025-11-01  
**Developer:** د. علي عبدالعال
