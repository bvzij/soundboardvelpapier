# Soundboard

Picture buttons that play a sound. Buttons sync across all devices via Vercel Blob storage.

- Anyone with the URL can play, add, edit or delete buttons (no login yet).
- Max file size: 4 MB per picture/sound (pictures are shrunk automatically).

## Setup (once)
1. Vercel: import this repo → Deploy (framework: Other).
2. Project → Storage → Create → Blob → access **Public** → connect to the project (all environments).
3. Redeploy.

## Use
- **+ Add**: pick a picture, a sound file (MP3, M4A, WAV, OGG…), optional label.
- **Tap** a button to play; tap again (or **■ Stop**) to stop.
- **Edit** (or long-press a button): change, move or delete it.
- Other devices pick up changes when the app is reopened, or within ~20 seconds.
- Install: open the URL in Chrome → menu (⋮) → Add to Home screen.

## Files
- `index.html` — the app
- `api/items.js` — list / save / delete buttons
- `api/media.js` — upload pictures and sounds
- `api/_store.js` — shared Blob helpers
