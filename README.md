# Looply: TikTok-style Social Media App

Looply is a lightweight short-video social media web app inspired by TikTok.

## What it includes
- Vertical full-screen video feed with autoplay/pause on scroll
- **For You** and **Following** feed tabs
- Search by creator handle or caption hashtag text
- Interactive actions: like, bookmark, comments, share link copy
- Create Post modal to publish a new video URL post locally
- Local persistence for custom posts using browser localStorage

## Run locally
```bash
python main.py --port 8000
```

Then open:
- `http://localhost:8000`

## Notes
- Demo videos are loaded from public sample MP4 URLs.
- Posts you create are stored in your browser, not in a server database.
