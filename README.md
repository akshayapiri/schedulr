# Schedulr - Weekly Timetable Builder

A beautiful and intuitive web application for students to build and manage their weekly class timetables.

## Features

- 📅 **Weekly Grid View**: Visual timetable from Monday to Sunday, 8 AM to 8 PM
- ➕ **Add/Edit/Delete Classes**: Manage classes with subject, teacher, room, and time details
- ⚠️ **Conflict Detection**: Automatically detects overlapping classes with red glow warnings
- 💾 **Local Storage**: Your timetable persists across browser sessions
- 📤 **Export/Import**: Save and load timetables as JSON files
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Mobile Friendly**: Responsive design with stacked view on smaller screens
- ✨ **Smooth Animations**: Beautiful transitions powered by Framer Motion

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Add a Class**: Click the "Add Class" button and fill in the details
2. **Edit a Class**: Click on any class block to edit it
3. **Delete a Class**: Click the × button on a class block
4. **Export**: Click "Export JSON" to download your timetable
5. **Import**: Click "Import JSON" to load a previously saved timetable
6. **Toggle Theme**: Click the sun/moon icon to switch between light and dark modes

## Color Scheme

- **Biscuit**: #C1A27F (primary accent)
- **Cove**: #5F6977 (secondary accent)

## Troubleshooting

### CORS Error / "Failed to load resource" Error

If you see errors like:
- `Access to script at 'file:///src/main.jsx' from origin 'null' has been blocked by CORS policy`
- `Failed to load resource: net::ERR_FAILED`

**Solution**: You're trying to open the HTML file directly in the browser. Vite apps must run through a development server.

1. Make sure you've installed dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open the URL shown in the terminal (usually `http://localhost:5173`)

**Never** open `index.html` directly in the browser - always use the dev server!

## Technologies

- React 18
- Vite
- Tailwind CSS
- Framer Motion

