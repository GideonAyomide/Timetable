# UniSchedule - Student Timetable & Course Planner

A modern, responsive, and intuitive web application designed for university students to track and organize their courses, class timings, venues, and lecturers. Built entirely with semantic **HTML5**, **Vanilla CSS**, and modern **ES6+ JavaScript** with zero external runtime dependencies.

---

## ✨ Features

- **Comprehensive Course Metadata**:
  - Course Name & Code (e.g. `CS 201 - Data Structures`)
  - Lecturer / Professor name (e.g. `Dr. Alan Turing`)
  - Venue / Room / Lab location (e.g. `Turing Hall, Room 301`)
  - Day of week (Monday through Sunday)
  - Start Time & End Time with automatic duration computation
  - Visual Color Tags (8 curated accents + custom hex color picker)
  - Notes / instructions / links

- **Multiple Interactive Views**:
  - **Weekly Timetable Grid**: Proportional visual matrix with sticky day headers, sticky time column, and real-time current time marker.
  - **Today's Agenda**: Sequential daily timeline with live status badges (`LIVE NOW`, `Upcoming`, `Finished`).
  - **Course Directory**: Searchable, filterable table with quick Edit and Delete controls.

- **Intelligent Productivity Tools**:
  - **Real-Time Conflict Detection**: Alerts the student when an added or edited course overlaps with an existing class on the same day.
  - **Local Persistence (`localStorage`)**: Saves timetable data automatically in the user's browser.
  - **Sample Demo Schedule**: One-click button to immediately populate realistic university courses for exploration.
  - **JSON Export & Import**: Easy backups and restoring of schedule files.
  - **Paper / PDF Print Support**: Clean `@media print` styling tailored for printing or saving crisp PDFs.
  - **Dark & Light Mode**: Fluid theme toggle with accessible contrast and custom color palettes.
  - **Keyboard Shortcuts**: Press `N` anywhere to quickly open the Add Class modal.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Structure** | Semantic HTML5 with ARIA accessibility roles |
| **Styling** | Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism) |
| **Typography** | Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*) |
| **Logic** | Vanilla ES6+ JavaScript (Modular IIFE pattern, zero external dependencies) |
| **Storage** | Browser `localStorage` API |
| **Local Server** | Minimal Node.js HTTP server (`serve.js`, zero npm packages required) |

---

## 🚀 Getting Started

### Option 1: Direct File Access (No Server Required)
Simply double-click [`index.html`](index.html) or open it in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended)
UniSchedule includes a lightweight zero-dependency server:

```bash
# Start the local server
node serve.js
```

Open your browser and navigate to:
```
http://localhost:3000/
```

---

## 📂 Project Structure

```
Timetable/
├── .gitignore         # Git ignore configuration
├── index.html         # Main application markup & modal dialogs
├── styles.css         # Design system tokens, layouts, themes, and print styles
├── app.js             # Core application logic, state, and view renderers
├── serve.js           # Lightweight static HTTP server
├── README.md          # Project documentation
└── JOURNAL.md         # Development journal (choices, logs, and parked ideas)
```

---

## ⌨️ Keyboard Shortcuts

- `N`: Open "Add Class" dialog (when no input field is focused).
- `Escape`: Close any open modal or dialog.

---

## 📄 License

MIT License. Free to use and customize for student and academic projects.
