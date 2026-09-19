# UniSchedule - Project Development Journal

A lightweight log documenting development progress, architectural choices, and deferred ideas for future iterations.

---

## 📅 Log Entry: 2026-09-19 — Initial Release & Architecture Setup

### 1. What Was Worked On
- **Core Architecture & UI**:
  - Implemented semantic HTML layout (`index.html`) featuring multi-tab views: Weekly Timetable Grid, Today's Agenda, and Course Directory.
  - Formulated modal dialogs for adding/editing courses with complete field validation (Course Name, Code, Lecturer, Venue, Day, Start/End Time, Color Badge, Notes).
  - Designed responsive visual hierarchy (`styles.css`) using CSS variables for theme tokens (Light and Dark mode), custom typography (*Plus Jakarta Sans* and *JetBrains Mono*), and sticky grid headers.
  - Implemented print-friendly media queries (`@media print`) for clean paper/PDF export without UI controls or dark backgrounds.
- **Client-Side Application Logic (`app.js`)**:
  - State management using reactive renderers for the weekly time matrix, daily agenda, and directory table.
  - Real-time time collision / schedule overlap detector warning students before saving.
  - Dynamic hour-range detection (auto-expands timetable grid based on class timings).
  - Search and filter functionality across course titles, lecturer names, venues, and days.
  - Demo dataset generator with university computer science courses.
  - JSON Export & Import handlers for data backup.
  - Dark/Light theme toggle with `localStorage` persistence.
- **Project Tooling & Git**:
  - Set up zero-dependency static server (`serve.js`).
  - Initialized Git version control with `.gitignore` and initial commit.

---

### 2. What Was Chosen (Decisions & Rationale)

| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| **Tech Stack** | Pure Vanilla HTML, CSS, and JS | Avoids complex build steps, node_modules bloat, or framework locks. Fast execution, instantly runnable in any browser. |
| **Storage Engine** | Browser `localStorage` | Zero authentication or server backend required. The user's schedule is stored privately and persists on their machine. |
| **Grid Math** | Proportional pixel calculation (`(minutes / 60) * hourHeight`) | Accurately renders classes of arbitrary durations (e.g. 1 hr 15 mins, 2 hr 45 mins) rather than forcing rigid 1-hour blocks. |
| **Conflict Behavior** | Warning Banner (Non-blocking) | Alerts students of overlapping times but permits saving in case they need to track concurrent tutorial streams or elective options. |
| **Typography** | Plus Jakarta Sans + JetBrains Mono | Modern, readable sans-serif for UI titles and labels, paired with a monospaced font for clean time-slot alignment. |
| **Weekend Support** | Optional Toggle (Mon–Fri default) | Keeps the weekly grid spacious and uncluttered for standard 5-day schedules while allowing weekend courses when needed. |

---

### 3. What Was Decided to Park (Future Considerations)

- 🅿️ **iCal / Google Calendar Export (`.ics`)**:
  - *Idea*: Generate `.ics` files so students can sync classes directly into Apple Calendar or Google Calendar.
  - *Reason to Park*: Kept initial release focused on the immediate in-app timetable and print/PDF export.
- 🅿️ **Multi-Semester / Profile Switching**:
  - *Idea*: Allow students to toggle between "Fall Semester" and "Spring Semester".
  - *Reason to Park*: Single schedule with JSON export/import satisfies backup and semester swap needs for now without adding UI complexity.
- 🅿️ **Cloud Sync / User Accounts (Firebase / Supabase)**:
  - *Idea*: Cross-device synchronization via login.
  - *Reason to Park*: Maintaining a privacy-first, offline-capable, client-side app with zero configuration is the current priority.
- 🅿️ **Exam & Assignment Deadlines Tracker**:
  - *Idea*: Add an assignments and test countdown sub-tab linked to each course.
  - *Reason to Park*: Focused strictly on timetable and class tracking first; assignments can be added in a future milestone.
