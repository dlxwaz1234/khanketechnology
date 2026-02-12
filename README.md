# Mobile Ordering System (Google Sheets + WhatsApp)

A lightweight, production-ready mobile ordering website built with Vanilla JS, HTML, and CSS.

## Features
- **Mobile-First Design**: Optimized for mobile browsers.
- **RTL Arabic Support**: Fully localized for Arabic users.
- **Google Sheets Database**: No backend needed. Live data from your sheet.
- **WhatsApp Integration**: Orders are sent directly to your WhatsApp number.
- **Full Cart System**: Persistent cart using localStorage.

## Setup Instructions

### 1. Google Sheet Structure
Your Google Sheet must have the following columns in the first row:
`name`, `price`, `image`, `description`

**Data Logic:**
- **Category**: Leave the `price` column **EMPTY**.
- **Item**: Fill the `price` column with a number.
- Items will automatically belong to the category listed above them.

### 2. Publish Your Sheet
1. Open your Google Sheet.
2. Go to **File > Share > Publish to web**.
3. Select **Entire Document** and **Comma-separated values (.csv)**.
4. Click **Publish** and copy the generated link.

### 3. Configure the Website
Open `api.js` and update the `CONFIG` object:
```javascript
const CONFIG = {
    // Paste your Google Sheet CSV link here
    SHEET_URL: 'YOUR_CSV_LINK_HERE',
    // Your WhatsApp number with country code (no + or 00)
    WHATSAPP_NUMBER: '9647503475937'
};
```

### 4. Deployment
Simply upload all files to any static web hosting (GitHub Pages, Netlify, Vercel, or your own server).

## Project Structure
- `index.html`: Redirects to categories.
- `categories.html`: Displays categories from the sheet.
- `items.html`: Displays items for a specific category.
- `style.css`: Modern RTL styling.
- `api.js`: Handles data fetching and CSV parsing.
- `cart.js`: Manages the shopping cart and WhatsApp order generation.
- `ui.js`: Handles DOM manipulation and page initialization.
