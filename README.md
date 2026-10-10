# PrepTrack — Interview Practice Tracker

A responsive React dashboard for keeping interview preparation focused and visible.

## Setup

1. Run `npm install`.
2. Start the app with `npm run dev`.
3. Open the local URL shown in the terminal.

Use `npm run build` for a production build.

## Features

- Dashboard cards for total questions, DSA, technical, and machine-coding progress.
- Add questions with category, difficulty, status, and optional notes.
- Search across question titles, categories, and notes.
- Filter by category, difficulty, and status.
- Inline status updates and deletion.
- Completion progress calculated automatically.
- LocalStorage persistence across browser refreshes.
- Responsive desktop/mobile layouts plus empty, no-results, and form-validation states.

## Assumptions

- Machine coding is complete when one Technical item is marked Completed.
- Progress is `completed questions / all saved questions`.
- This frontend-only app deliberately uses browser LocalStorage rather than a backend.
