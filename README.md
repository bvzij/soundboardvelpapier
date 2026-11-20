# Soundboard

A simple soundboard for an Android tablet: picture buttons that play a sound.

- Pictures and sounds are stored on the device that adds them (browser storage), not on the server.
- Anyone can open the URL, but they only see their own (empty) board.

## Deploy
Static site, no build step. In Vercel: Add New → Project → import this repo → Deploy.

## Use
- **+ Add**: pick a picture, a sound file (MP3, M4A, WAV, OGG…), optional label.
- **Tap** a button to play; tap it again (or **■ Stop**) to stop.
- **Edit** (or long-press a button): change, move or delete it.
- Install: open the URL in Chrome → menu (⋮) → Add to Home screen.
