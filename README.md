# Australian Fixed Income — PWA deployment guide

This folder contains everything needed to host the tutorial as an installable mobile app.

## Files

| File | What it is |
|------|------------|
| `index.html` | The tutorial itself |
| `manifest.json` | Web app manifest (name, icon, colours) |
| `service-worker.js` | Caches the page so it works offline |
| `icon.svg` | Vector home-screen icon |
| `icon-192.png`, `icon-512.png` | Standard PNG icons |
| `icon-maskable-512.png` | Android adaptive icon |
| `apple-touch-icon.png` | iOS home-screen icon |

## Deploy to GitHub Pages (5 minutes)

1. **Create a new public repository on GitHub.** Call it whatever you like — e.g. `fi-tutorial`.

2. **Upload all the files in this folder.** Either:
   - Use the GitHub web UI: open the new repo, click "Add file" → "Upload files", drag everything in, click "Commit changes".
   - Or use the command line:
     ```
     git clone https://github.com/YOUR-USERNAME/fi-tutorial.git
     cd fi-tutorial
     # copy these files in
     git add .
     git commit -m "Initial upload"
     git push
     ```

3. **Enable Pages.** In your repo, go to **Settings → Pages**. Under "Build and deployment", set "Source" to "Deploy from a branch", "Branch" to `main`, folder `/ (root)`. Click Save.

4. **Wait ~1 minute.** GitHub Pages takes a moment to build. Refresh the Settings → Pages page until you see "Your site is live at https://YOUR-USERNAME.github.io/fi-tutorial/".

5. **Open that URL on your phone.** First visit downloads everything; after that it works offline.

## Install on your phone

### iPhone (Safari)
1. Open the URL in **Safari** (must be Safari, not Chrome).
2. Tap the **Share** button (square with arrow up).
3. Scroll down, tap **"Add to Home Screen"**.
4. Confirm the name "AUS FI" — tap Add.
5. The app icon appears on your home screen. Tap it → opens in fullscreen, works offline.

### Android (Chrome / Edge / Firefox)
1. Open the URL in Chrome.
2. You'll see a "↓ Install as app" button in the top-right (or "Install" in the address bar).
3. Tap it → confirm.
4. The app icon appears in your app drawer.

## How it works offline

On the first visit, the service worker downloads and caches:
- the HTML, manifest, icons (instant)
- Google Fonts (Fraunces, Inter, JetBrains Mono)
- MathJax library
- the polyfill script

You'll see a small green toast "✓ Ready to use offline" once caching is done (~5-10 seconds on a normal connection). After that, the app loads instantly with no network needed.

## Updating

If you ever change `index.html`:
1. Bump the `CACHE_VERSION` in `service-worker.js` (e.g. `'ausfi-v1'` → `'ausfi-v2'`).
2. Push the changes. The next time someone opens the app online, they'll get the new version.
