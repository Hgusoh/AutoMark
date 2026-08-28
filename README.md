# Watermark PDF / PNG (Version 1.0.0: 2026-08-27)

A simple, single-page web app to bulk-add a watermark to PDF and PNG files, directly in the browser — no upload, no server, no installation.

🔗 **Live demo:** [https://hgusoh.github.io/AutoMark/](https://hgusoh.github.io/AutoMark/)

## What it does

1. Pick a source folder (recursively scanned for `.pdf` and `.png` files)
2. Pick a destination folder (the folder structure is mirrored there)
3. Type the watermark text
4. Click "Lancer" — every file gets a repeated, semi-transparent watermark and is saved into the destination folder

All processing happens locally in your browser. No file ever leaves your computer.

## Tech stack

- Vanilla JavaScript (no framework, no build step, no modules — plain `<script>` tags so it also works when opened directly via `file://`)
- [pdf-lib](https://pdf-lib.js.org/) for PDF manipulation
- Canvas API for PNG manipulation
- [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/) for styling

## Browser requirement

This app relies on the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) (`showDirectoryPicker`), which is only supported in **Chromium-based browsers** (Chrome, Edge, Brave...). It does not work in Firefox or Safari.

## Running it

### Option 1 — Directly
Just open `index.html` in Chrome or Edge (double-click works).

### Option 2 — Local server
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Project structure

```
watermark-app/
├── index.html          # UI (Bootstrap layout)
├── favicon.svg
└── js/
    ├── ui.js            # DOM updates (log panel, folder selection cards)
    ├── watermark.js     # PDF and PNG watermarking logic
    ├── fileSystem.js    # Recursive folder traversal
    └── main.js          # Event wiring / entry point
```

## Limitations

- Only `.pdf` and `.png` files are processed; other formats are skipped.
- Browsers never expose the absolute filesystem path of a selected folder (only its name), for security reasons — this is a browser limitation, not something this app can work around.
