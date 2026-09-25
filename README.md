# Aravind & Niveditha — Wedding Invitation Website

A cinematic, mobile-first Kerala heritage wedding invitation, cloned and rebuilt from the
Naadham–Rishi reference site with fully new content, media and structure for
Adv. Aravind E B & Adv. Niveditha Prakasan.

## What's inside
- `index.html` — the entire site (HTML + CSS + JS in one file, referencing the `assets/` folder)
- `assets/video/` — `opening.mp4` (the full-screen opening film: plays when guests tap "Open the Invitation" on the entrance screen; `opening-first-frame.jpg` is its poster), and one video per celebration (Haldi, Mehendi,
  Sangeeth, Thalikettu & Wedding, Reception)
- `assets/images/` — Naadham-style backgrounds (01–07, reused from the reference), couple photographs, and auto-extracted poster
  stills for each celebration video, plus a ready `og-image.jpg` (1200×630) for WhatsApp/social sharing
- `assets/audio/theme-music.mp4` — optional background music (from the reference project; swap out
  if you'd like different music)
- `google-apps-script.gs` — RSVP-to-Google-Sheet handler, adapted for this couple

## Before you publish this, please do 3 things

1. **RSVP form**: Deploy `google-apps-script.gs` to your own Google account (step-by-step in the comment block at the top of that file; it builds an `RSVPs` tab and a live `Summary` tab with total guests and per-celebration counts), then paste the resulting `/exec` URL into
   `index.html` where it says:
   `const RSVP_SHEET_ENDPOINT = "PASTE_YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE";`
   Until you do this, the form will still show guests a "thank you" confirmation, but responses
   won't be saved anywhere.

2. **Haldi / Mehendi / Sangeeth venues**: your brief didn't include specific venue names/addresses
   for these three events (only date, time and dress code), so the site currently shows
   "Family Residence" / "Details shared with close family" as a placeholder. Search-and-replace
   those in `index.html` once you have the exact venue.

3. **Hosting**: because the celebration videos total ~30MB, this site is delivered as real files
   rather than a single embeddable link. Host the whole `site` folder (as-is, keeping the folder
   structure) on any static host — Netlify, Vercel, GitHub Pages, or your own server — and the
   root `index.html` will work immediately. Do not rename the `assets` folder or its subfolders.

## Notes on content decisions
- The "Our Journey" section deliberately stays short and general (per your instructions not to
  invent relationship history that wasn't supplied).
- The reference site's "Adukkala Kaanal" post-wedding family-visit section was removed entirely,
  since no equivalent event was described in your brief.
- Dr. Nandana Prakasan (bride's sister) appears in both the "Meet the Couple" and "Our Families"
  sections.
- Countdown target: 4 January 2027, 11:15 AM IST (Thalikettu).

## Update: closer Naadham–Rishi fidelity
- Backgrounds, gate/entrance and section mapping now use the reference site's own images (01–07), in the same section order and overlays.
- The lotus tap-to-reveal interaction is removed. The former "Destiny Unfolds" section has also been removed; `opening.mp4` now plays only on the entrance screen.
- The generated heritage-house image and the "Where Traditions Begin" section are removed.
- Couple photos appear unedited in "Meet the Couple", "Our Journey" and the gallery.
- Calendar: every event has Google Calendar + .ics (VALARM `TRIGGER:-P3D`), plus a combined .ics. Note: Google Calendar's web link cannot carry a reminder; the 3-day reminder is in the .ics files.
- The "Our Moments" gallery is removed. RSVP now also records which celebrations each guest will attend.
