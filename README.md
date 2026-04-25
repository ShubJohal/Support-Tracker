# WorkLog — Mac Task Time Tracker

A beautiful, minimal desktop app for tracking tasks and time per client.

## Features
- Create clients with colour coding
- Add tasks per client with start / pause / stop timers
- Add subtasks to any task — each with their own independent timer
- All data saved locally (no internet required)
- Running total across all clients shown in sidebar
- Dark, modern design with macOS native titlebar

---

## Run on Mac (Development)

### Prerequisites
- Node.js 18+ — download from https://nodejs.org

### Steps

```bash
# 1. Open Terminal and go into the app folder
cd worklog-app

# 2. Install dependencies
npm install

# 3. Run the app
npm start
```

The app will open as a native macOS window.

---

## Build a distributable .dmg (Mac App)

```bash
# Install dependencies first
npm install

# Build the Mac app
npm run build
```

This creates a `dist/` folder containing:
- `WorkLog.dmg` — drag-to-install Mac app
- `WorkLog-mac.zip` — zipped app bundle

> Note: To distribute outside the Mac App Store, you'll need an Apple Developer account for code signing. For personal use, you can open the unsigned app by right-clicking → Open.

---

## Build for Windows

```bash
npm run build-win
```

Creates a Windows installer in `dist/`.

---

## Project Structure

```
worklog-app/
├── main.js          ← Electron main process
├── preload.js       ← Secure bridge between UI and Node
├── index.html       ← Full app UI (HTML/CSS/JS)
├── package.json     ← Dependencies & build config
└── README.md
```

## Data Storage
All data is stored locally in your system's app data folder:
- Mac: `~/Library/Application Support/worklog/worklog-data.json`
- Windows: `%APPDATA%\worklog\worklog-data.json`
