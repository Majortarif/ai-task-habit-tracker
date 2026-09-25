# Pulse — AI-Assisted Task & Habit Tracker

## Overview

Pulse is a browser-based productivity app that combines a task manager, a habit tracker with real streak calculation, and a rule-based "AI" productivity coach. It runs entirely client-side — there is no backend, no database, and no API key required. All data is stored in the browser's LocalStorage, so it works the moment you open `index.html`, and deploys to Netlify as a static site with zero configuration.

## Features

- **Dashboard** — greeting, live stats (total/active/completed tasks, completion rate, today's habits, current streak) that update automatically as you work.
- **Task management** — add, edit, delete, complete/reactivate tasks, with priority (High/Medium/Low), due dates, descriptions, search, filters (status, priority, due date), and sorting (newest, oldest, priority, due date).
- **Habit tracker** — add/edit/delete habits, daily check-ins, real streak calculation (current + best) computed from completion history dates, a 7-day weekly overview, and per-habit completion rate.
- **AI Productivity Coach** — a smart, rule-based simulator (clearly labeled as such, no external AI API) that generates contextual tips from your actual task/habit data, plus an interactive Q&A box that answers questions like "What should I do first?" or "Give me a plan for today."
- **Analytics** — a clean breakdown of task and habit progress, plus a combined weekly habit overview.
- **Dark/light mode** with smooth transitions, saved to LocalStorage.
- **Data portability** — export your data as a JSON file, import a previous backup, or clear everything with a confirmation step.
- **Toast notifications**, empty states, and subtle micro-animations throughout.
- Fully responsive, accessible (semantic HTML, focus states, ARIA labels), and safe against XSS (all user content is escaped before rendering).

## Tech Stack

- HTML5
- Tailwind CSS (via CDN — no build step)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- Font Awesome (icons) and Google Fonts (Sora + Inter)

## AI Coach — Honest Disclosure

The "AI Productivity Coach" does **not** call any external AI service or LLM API. It is a deterministic, rule-based simulator written in plain JavaScript (`script.js`) that inspects your current tasks and habits — counts, priorities, due dates, streaks, and completion rates — and returns contextual, varied messages based on that data. This is clearly labeled in the app itself ("AI Coach — Smart Productivity Simulator").

## Project Structure

```
ai-task-habit-tracker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run Locally

1. Download or clone the project folder.
2. Open `index.html` directly in any modern browser (double-click it, or right-click → Open With → your browser).
3. That's it — no install, no build, no server required.

## Deployment (Netlify)

1. Create a new GitHub repository and push these four files to it.
2. Log in to [Netlify](https://app.netlify.com) and click **Add new site → Import an existing project**.
3. Connect your GitHub account and select the repository.
4. Leave the **build command** blank and set the **publish directory** to the repository root (`/`).
5. Click **Deploy site**. Netlify will serve `index.html` immediately — no environment variables or backend needed.

You can also drag-and-drop the project folder directly onto Netlify's "Deploys" page for an instant deploy without GitHub.

## Future Improvements

- Real AI API integration (e.g. Claude) for richer, natural-language coaching
- User authentication and multi-user accounts
- Cloud database for persistent, device-independent storage
- Cross-device synchronization
- Advanced analytics (charts over time, monthly trends)
- Calendar integration and reminders/notifications

## Author

**Tariful Hoque**

- Portfolio: https://tarifulhoqueportfoloi.netlify.app/
- LinkedIn: https://www.linkedin.com/in/tariful-hoque-582321259
- GitHub: https://github.com/Majortarif
