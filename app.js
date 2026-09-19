/**
 * UniSchedule - Modern Student Timetable Creator
 * Pure ES6+ Vanilla JavaScript Logic
 */

(function () {
  'use strict';

  // ==========================================================================
  // Constants & Initial State
  // ==========================================================================

  const STORAGE_KEY = 'unischedule_courses_v1';
  const THEME_KEY = 'unischedule_theme_preference';
  const WEEKEND_KEY = 'unischedule_show_weekends';

  const DAYS_ALL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const DAYS_WEEKDAY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const DEFAULT_START_HOUR = 8; // 08:00
  const DEFAULT_END_HOUR = 19;  // 19:00 (7 PM)
  const HOUR_HEIGHT = 70;       // px per hour row

  // Demo University Schedule
  const SAMPLE_COURSES = [
    {
      id: 'demo_1',
      name: 'Data Structures & Algorithms',
      code: 'CS 201',
      lecturer: 'Dr. Alan Turing',
      venue: 'Turing Hall, Room 301',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      color: '#3B82F6',
      notes: 'Bring laptop for tree traversal and graph lab exercises.'
    },
    {
      id: 'demo_2',
      name: 'Computer Networks',
      code: 'CS 305',
      lecturer: 'Dr. Grace Hopper',
      venue: 'Engineering Block, Lab 4',
      day: 'Monday',
      startTime: '11:00',
      endTime: '12:30',
      color: '#10B981',
      notes: 'Packet sniffing Wireshark assignment due.'
    },
    {
      id: 'demo_3',
      name: 'Software Engineering Principles',
      code: 'CS 220',
      lecturer: 'Dr. Barbara Liskov',
      venue: 'Lecture Hall B',
      day: 'Tuesday',
      startTime: '10:00',
      endTime: '11:45',
      color: '#8B5CF6',
      notes: 'Agile sprint planning & review session.'
    },
    {
      id: 'demo_4',
      name: 'Information Theory & Cryptography',
      code: 'MATH 310',
      lecturer: 'Prof. Claude Shannon',
      venue: 'Main Science Auditorium',
      day: 'Wednesday',
      startTime: '09:00',
      endTime: '10:30',
      color: '#F59E0B',
      notes: 'Textbook chapters 4 & 5 recommended.'
    },
    {
      id: 'demo_5',
      name: 'Database Management Systems',
      code: 'CS 240',
      lecturer: 'Dr. Edgar Codd',
      venue: 'Computing Lab 2',
      day: 'Wednesday',
      startTime: '13:00',
      endTime: '15:00',
      color: '#06B6D4',
      notes: 'PostgreSQL optimization & query execution plans.'
    },
    {
      id: 'demo_6',
      name: 'Operating Systems & Kernel Dev',
      code: 'CS 315',
      lecturer: 'Prof. Linus Torvalds',
      venue: 'Hall C - Room 102',
      day: 'Thursday',
      startTime: '11:00',
      endTime: '12:30',
      color: '#EF4444',
      notes: 'Virtual memory paging and concurrency locks.'
    },
    {
      id: 'demo_7',
      name: 'Artificial Intelligence & Machine Learning',
      code: 'CS 440',
      lecturer: 'Dr. Geoffrey Hinton',
      venue: 'Innovation Hub, Floor 2',
      day: 'Friday',
      startTime: '14:00',
      endTime: '16:00',
      color: '#EC4899',
      notes: 'Neural net backpropagation workshop.'
    }
  ];

  // Application State
  const state = {
    courses: [],
    currentView: 'weekly', // 'weekly' | 'agenda' | 'directory'
    searchQuery: '',
    showWeekends: false,
    selectedAgendaDay: getCurrentDayName(),
    activeDetailCourseId: null,
    editingCourseId: null
  };

  // ==========================================================================
  // DOM Elements Cache
  // ==========================================================================

  const dom = {
    // Buttons & Header
    liveClock: document.getElementById('liveClock'),
    addCourseBtn: document.getElementById('addCourseBtn'),
    demoDataBtn: document.getElementById('demoDataBtn'),
    printBtn: document.getElementById('printBtn'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    weekendToggle: document.getElementById('weekendToggle'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),

    // Tabs & Panels
    tabWeekly: document.getElementById('tabWeekly'),
    tabAgenda: document.getElementById('tabAgenda'),
    tabDirectory: document.getElementById('tabDirectory'),
    todayBadgeCount: document.getElementById('todayBadgeCount'),
    totalCoursesBadge: document.getElementById('totalCoursesBadge'),
    weeklyViewPanel: document.getElementById('weeklyViewPanel'),
    agendaViewPanel: document.getElementById('agendaViewPanel'),
    directoryViewPanel: document.getElementById('directoryViewPanel'),

    // Timetable Grid
    timetableGrid: document.getElementById('timetableGrid'),
    timetableScrollWrapper: document.getElementById('timetableScrollWrapper'),

    // Agenda Elements
    agendaDayTitle: document.getElementById('agendaDayTitle'),
    agendaDaySubtitle: document.getElementById('agendaDaySubtitle'),
    agendaDayPicker: document.getElementById('agendaDayPicker'),
    agendaTimeline: document.getElementById('agendaTimeline'),

    // Directory Elements
    coursesTableBody: document.getElementById('coursesTableBody'),
    emptyState: document.getElementById('emptyState'),
    emptyAddBtn: document.getElementById('emptyAddBtn'),
    exportJsonBtn: document.getElementById('exportJsonBtn'),
    importJsonInput: document.getElementById('importJsonInput'),
    clearAllBtn: document.getElementById('clearAllBtn'),

    // Modal - Add/Edit Form
    courseModalBackdrop: document.getElementById('courseModalBackdrop'),
    modalTitle: document.getElementById('modalTitle'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    courseForm: document.getElementById('courseForm'),
    conflictAlert: document.getElementById('conflictAlert'),
    conflictMessage: document.getElementById('conflictMessage'),
    courseId: document.getElementById('courseId'),
    courseName: document.getElementById('courseName'),
    courseCode: document.getElementById('courseCode'),
    lecturerName: document.getElementById('lecturerName'),
    venueName: document.getElementById('venueName'),
    courseDay: document.getElementById('courseDay'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime'),
    selectedColor: document.getElementById('selectedColor'),
    customColorPicker: document.getElementById('customColorPicker'),
    colorPalettePicker: document.getElementById('colorPalettePicker'),
    courseNotes: document.getElementById('courseNotes'),
    courseNameError: document.getElementById('courseNameError'),
    lecturerNameError: document.getElementById('lecturerNameError'),
    venueNameError: document.getElementById('venueNameError'),
    startTimeError: document.getElementById('startTimeError'),
    endTimeError: document.getElementById('endTimeError'),

    // Modal - Details
    detailModalBackdrop: document.getElementById('detailModalBackdrop'),
    closeDetailModalBtn: document.getElementById('closeDetailModalBtn'),
    detailColorStrip: document.getElementById('detailColorStrip'),
    detailCourseCode: document.getElementById('detailCourseCode'),
    detailCourseName: document.getElementById('detailCourseName'),
    detailSchedule: document.getElementById('detailSchedule'),
    detailDuration: document.getElementById('detailDuration'),
    detailVenue: document.getElementById('detailVenue'),
    detailLecturer: document.getElementById('detailLecturer'),
    detailNotesBox: document.getElementById('detailNotesBox'),
    detailNotes: document.getElementById('detailNotes'),
    detailEditBtn: document.getElementById('detailEditBtn'),
    detailDeleteBtn: document.getElementById('detailDeleteBtn'),

    // Toasts
    toastContainer: document.getElementById('toastContainer')
  };

  // ==========================================================================
  // Helper Utilities
  // ==========================================================================

  function getCurrentDayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  function parseMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m < 10 ? '0' + m : m;
    return `${displayH}:${displayM} ${period}`;
  }

  function formatDuration(startStr, endStr) {
    const diff = parseMinutes(endStr) - parseMinutes(startStr);
    if (diff <= 0) return '0 mins';
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    if (hours > 0 && mins > 0) return `${hours} hr ${mins} mins`;
    if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
    return `${mins} mins`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function generateId() {
    return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  }

  // ==========================================================================
  // Storage & Theme Management
  // ==========================================================================

  function loadState() {
    // Load courses
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.courses = JSON.parse(stored);
      } else {
        // First visit: load sample courses
        state.courses = [...SAMPLE_COURSES];
        saveCourses();
      }
    } catch (e) {
      console.error('Failed to load courses from localStorage', e);
      state.courses = [...SAMPLE_COURSES];
    }

    // Load weekend toggle preference
    const savedWeekend = localStorage.getItem(WEEKEND_KEY);
    if (savedWeekend !== null) {
      state.showWeekends = savedWeekend === 'true';
    } else {
      // Auto-enable weekends if existing courses use Saturday or Sunday
      const hasWeekendCourse = state.courses.some(c => c.day === 'Saturday' || c.day === 'Sunday');
      state.showWeekends = hasWeekendCourse;
    }
    dom.weekendToggle.checked = state.showWeekends;

    // Load theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  function saveCourses() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.courses));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      showToast('Could not save to local storage', 'error');
    }
    updateBadgeCounts();
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  }

  // ==========================================================================
  // Toast Notification System
  // ==========================================================================

  function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    if (type === 'success') {
      icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // ==========================================================================
  // Live Clock & Status
  // ==========================================================================

  function updateClock() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    dom.liveClock.textContent = now.toLocaleDateString(undefined, options);

    // Refresh current time indicator in timetable if active
    if (state.currentView === 'weekly') {
      renderCurrentTimeMarker();
    }
  }

  setInterval(updateClock, 1000);
  updateClock();

  // ==========================================================================
  // Overlap / Conflict Detection
  // ==========================================================================

  function findConflicts(day, startStr, endStr, ignoreId = null) {
    const startM = parseMinutes(startStr);
    const endM = parseMinutes(endStr);

    return state.courses.filter(course => {
      if (ignoreId && course.id === ignoreId) return false;
      if (course.day !== day) return false;
      const cStartM = parseMinutes(course.startTime);
      const cEndM = parseMinutes(course.endTime);
      // Overlap condition: start < otherEnd && end > otherStart
      return startM < cEndM && endM > cStartM;
    });
  }

  function validateCourseTimes() {
    const startVal = dom.startTime.value;
    const endVal = dom.endTime.value;
    const dayVal = dom.courseDay.value;
    const idVal = dom.courseId.value;

    dom.startTimeError.textContent = '';
    dom.endTimeError.textContent = '';
    dom.conflictAlert.style.display = 'none';

    if (!startVal || !endVal) return false;

    if (parseMinutes(startVal) >= parseMinutes(endVal)) {
      dom.endTimeError.textContent = 'End time must be after start time';
      return false;
    }

    const conflicts = findConflicts(dayVal, startVal, endVal, idVal || null);
    if (conflicts.length > 0) {
      dom.conflictAlert.style.display = 'flex';
      dom.conflictMessage.textContent = `Schedule conflict: Overlaps with "${conflicts[0].name}" (${conflicts[0].startTime} - ${conflicts[0].endTime})`;
    }

    return true;
  }

  // ==========================================================================
  // Timetable Calculation (Dynamic Hours & Grid)
  // ==========================================================================

  function getActiveDays() {
    return state.showWeekends ? DAYS_ALL : DAYS_WEEKDAY;
  }

  function getCalculatedHourRange() {
    let minHour = DEFAULT_START_HOUR;
    let maxHour = DEFAULT_END_HOUR;

    state.courses.forEach(c => {
      const sH = Math.floor(parseMinutes(c.startTime) / 60);
      const eH = Math.ceil(parseMinutes(c.endTime) / 60);
      if (sH < minHour) minHour = Math.max(0, sH - 1);
      if (eH > maxHour) maxHour = Math.min(24, eH + 1);
    });

    return { startHour: minHour, endHour: maxHour };
  }

  // ==========================================================================
  // Render: Weekly Grid View
  // ==========================================================================

  function renderWeeklyGrid() {
    const activeDays = getActiveDays();
    const { startHour, endHour } = getCalculatedHourRange();
    const totalHours = endHour - startHour;
    const currentDay = getCurrentDayName();

    dom.timetableGrid.innerHTML = '';

    // Define Grid Template: Time Col + Day Cols
    const colTemplate = `var(--time-col-width) repeat(${activeDays.length}, minmax(130px, 1fr))`;
    dom.timetableGrid.style.gridTemplateColumns = colTemplate;

    // 1. Top-Left Corner Cell
    const cornerCell = document.createElement('div');
    cornerCell.className = 'grid-header-cell grid-corner-cell';
    cornerCell.textContent = 'Time';
    dom.timetableGrid.appendChild(cornerCell);

    // 2. Day Header Cells
    activeDays.forEach(day => {
      const headerCell = document.createElement('div');
      headerCell.className = `grid-header-cell ${day === currentDay ? 'is-today' : ''}`;
      headerCell.innerHTML = `
        <span>${day}</span>
        ${day === currentDay ? '<span class="today-indicator">Today</span>' : ''}
      `;
      dom.timetableGrid.appendChild(headerCell);
    });

    // 3. Time Gutter Rows & Day Column Containers
    // Create Time Column
    const timeCol = document.createElement('div');
    timeCol.className = 'grid-time-column';
    timeCol.style.gridColumn = '1';
    timeCol.style.gridRow = `2 / span ${totalHours}`;

    for (let h = startHour; h < endHour; h++) {
      const timeCell = document.createElement('div');
      timeCell.className = 'grid-time-cell';
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      timeCell.textContent = `${displayH}:00 ${period}`;
      timeCol.appendChild(timeCell);
    }
    dom.timetableGrid.appendChild(timeCol);

    // Filter courses based on search query
    const filteredCourses = getFilteredCourses();

    // 4. Create Day Columns with Class Cards
    activeDays.forEach((day, index) => {
      const colIndex = index + 2;
      const dayCol = document.createElement('div');
      dayCol.className = `grid-day-col ${day === currentDay ? 'is-today' : ''}`;
      dayCol.style.gridColumn = `${colIndex}`;
      dayCol.style.gridRow = `2 / span ${totalHours}`;
      dayCol.style.height = `${totalHours * HOUR_HEIGHT}px`;

      // Hour background grid lines
      for (let h = startHour; h < endHour; h++) {
        const line = document.createElement('div');
        line.className = 'grid-hour-row-line';
        dayCol.appendChild(line);
      }

      // Add Courses for this day
      const dayCourses = filteredCourses.filter(c => c.day === day);

      dayCourses.forEach(course => {
        const startM = parseMinutes(course.startTime);
        const endM = parseMinutes(course.endTime);
        const dayStartM = startHour * 60;

        const topPx = ((startM - dayStartM) / 60) * HOUR_HEIGHT;
        const heightPx = Math.max(34, ((endM - startM) / 60) * HOUR_HEIGHT - 4); // small margin

        const card = document.createElement('div');
        card.className = 'course-card';
        card.setAttribute('data-id', course.id);
        card.style.top = `${topPx}px`;
        card.style.height = `${heightPx}px`;
        card.style.setProperty('--card-color', course.color || '#3b82f6');
        
        // Light subtle background tint derived from card color
        card.style.backgroundColor = `color-mix(in srgb, ${course.color || '#3b82f6'} 10%, var(--bg-surface))`;

        card.innerHTML = `
          <div class="card-time-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${formatTime(course.startTime)} - ${formatTime(course.endTime)}
          </div>
          <div class="card-title">
            ${escapeHtml(course.name)}
            ${course.code ? `<span class="card-code">${escapeHtml(course.code)}</span>` : ''}
          </div>
          <div class="card-meta-line" title="Venue: ${escapeHtml(course.venue)}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${escapeHtml(course.venue)}</span>
          </div>
          <div class="card-meta-line" title="Lecturer: ${escapeHtml(course.lecturer)}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>${escapeHtml(course.lecturer)}</span>
          </div>
        `;

        card.addEventListener('click', () => openCourseDetail(course.id));
        dayCol.appendChild(card);
      });

      dom.timetableGrid.appendChild(dayCol);
    });

    renderCurrentTimeMarker();
  }

  function renderCurrentTimeMarker() {
    // Remove existing marker
    const oldMarker = document.querySelector('.current-time-marker');
    if (oldMarker) oldMarker.remove();

    const currentDay = getCurrentDayName();
    const activeDays = getActiveDays();
    const dayIndex = activeDays.indexOf(currentDay);
    if (dayIndex === -1) return;

    const { startHour, endHour } = getCalculatedHourRange();
    const now = new Date();
    const currentM = now.getHours() * 60 + now.getMinutes();
    const dayStartM = startHour * 60;
    const dayEndM = endHour * 60;

    if (currentM < dayStartM || currentM > dayEndM) return;

    const topPx = ((currentM - dayStartM) / 60) * HOUR_HEIGHT;
    const dayCols = dom.timetableGrid.querySelectorAll('.grid-day-col');
    if (dayCols[dayIndex]) {
      const marker = document.createElement('div');
      marker.className = 'current-time-marker';
      marker.style.top = `${topPx}px`;
      dayCols[dayIndex].appendChild(marker);
    }
  }

  // ==========================================================================
  // Render: Today's Agenda View
  // ==========================================================================

  function renderAgendaDayPicker() {
    dom.agendaDayPicker.innerHTML = '';
    const activeDays = getActiveDays();
    const currentDay = getCurrentDayName();

    activeDays.forEach(day => {
      const chip = document.createElement('button');
      chip.className = `agenda-day-chip ${day === state.selectedAgendaDay ? 'active' : ''}`;
      chip.textContent = day === currentDay ? `${day} (Today)` : day;
      chip.addEventListener('click', () => {
        state.selectedAgendaDay = day;
        renderAgendaDayPicker();
        renderAgendaTimeline();
      });
      dom.agendaDayPicker.appendChild(chip);
    });
  }

  function renderAgendaTimeline() {
    const day = state.selectedAgendaDay;
    const currentDay = getCurrentDayName();
    const isToday = day === currentDay;

    dom.agendaDayTitle.textContent = isToday ? "Today's Schedule" : `${day}'s Schedule`;
    dom.agendaDaySubtitle.textContent = `Classes and sessions planned for ${day}`;

    const filtered = getFilteredCourses().filter(c => c.day === day);
    // Sort chronologically by start time
    filtered.sort((a, b) => parseMinutes(a.startTime) - parseMinutes(b.startTime));

    dom.agendaTimeline.innerHTML = '';

    if (filtered.length === 0) {
      dom.agendaTimeline.innerHTML = `
        <div class="empty-state" style="display: block; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div class="empty-icon">☕</div>
          <h3>No classes scheduled for ${day}</h3>
          <p>Enjoy your free time or add a new study session!</p>
        </div>
      `;
      return;
    }

    const now = new Date();
    const currentM = now.getHours() * 60 + now.getMinutes();

    filtered.forEach(course => {
      const startM = parseMinutes(course.startTime);
      const endM = parseMinutes(course.endTime);
      
      const isNow = isToday && (currentM >= startM && currentM <= endM);
      const isPast = isToday && (currentM > endM);
      const isUpcoming = isToday && (currentM < startM);

      const card = document.createElement('div');
      card.className = `agenda-card ${isNow ? 'is-now' : ''}`;
      card.style.setProperty('--item-color', course.color || '#3b82f6');

      let statusBadge = '';
      if (isNow) {
        statusBadge = '<span class="agenda-badge-now">LIVE NOW</span>';
      } else if (isPast) {
        statusBadge = '<span class="agenda-badge-status">Finished</span>';
      } else if (isUpcoming) {
        statusBadge = '<span class="agenda-badge-status">Upcoming</span>';
      }

      card.innerHTML = `
        <div class="agenda-time-col">
          <div class="agenda-time-text">${formatTime(course.startTime)} - ${formatTime(course.endTime)}</div>
          <div class="agenda-duration-text">${formatDuration(course.startTime, course.endTime)}</div>
        </div>

        <div class="agenda-info-col">
          <div class="agenda-title-wrap">
            <h3 class="agenda-title">${escapeHtml(course.name)}</h3>
            ${course.code ? `<span class="course-code-pill">${escapeHtml(course.code)}</span>` : ''}
            ${statusBadge}
          </div>

          <div class="agenda-meta-row">
            <div class="agenda-meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <strong>Venue:</strong> ${escapeHtml(course.venue)}
            </div>
            <div class="agenda-meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <strong>Lecturer:</strong> ${escapeHtml(course.lecturer)}
            </div>
          </div>
        </div>

        <div>
          <button class="btn btn-outline btn-sm">View Details</button>
        </div>
      `;

      card.addEventListener('click', () => openCourseDetail(course.id));
      dom.agendaTimeline.appendChild(card);
    });
  }

  // ==========================================================================
  // Render: Course Directory View (Table)
  // ==========================================================================

  function renderCourseDirectory() {
    const filtered = getFilteredCourses();
    // Sort by Day then Start Time
    filtered.sort((a, b) => {
      const dayOrder = DAYS_ALL.indexOf(a.day) - DAYS_ALL.indexOf(b.day);
      if (dayOrder !== 0) return dayOrder;
      return parseMinutes(a.startTime) - parseMinutes(b.startTime);
    });

    dom.coursesTableBody.innerHTML = '';

    if (filtered.length === 0) {
      dom.coursesTableBody.parentElement.style.display = 'none';
      dom.emptyState.style.display = 'block';
      return;
    }

    dom.coursesTableBody.parentElement.style.display = 'table';
    dom.emptyState.style.display = 'none';

    filtered.forEach(course => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="course-cell-title">
            <span class="color-indicator-dot" style="background-color: ${course.color || '#3b82f6'};"></span>
            <div>
              <strong>${escapeHtml(course.name)}</strong>
              ${course.code ? `<div><span class="course-code-pill">${escapeHtml(course.code)}</span></div>` : ''}
            </div>
          </div>
        </td>
        <td>
          <div><strong>${escapeHtml(course.day)}</strong></div>
          <span class="time-pill">${formatTime(course.startTime)} - ${formatTime(course.endTime)}</span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${escapeHtml(course.venue)}
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            ${escapeHtml(course.lecturer)}
          </div>
        </td>
        <td>
          <span class="text-secondary" style="font-size: 0.8rem;">${formatDuration(course.startTime, course.endTime)}</span>
        </td>
        <td class="text-right">
          <div class="action-btn-group">
            <button class="table-icon-btn edit-btn" title="Edit course" data-id="${course.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="table-icon-btn delete-btn" title="Delete course" data-id="${course.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;

      row.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openEditCourseModal(course.id);
      });

      row.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteCourse(course.id);
      });

      row.addEventListener('click', () => openCourseDetail(course.id));
      row.style.cursor = 'pointer';

      dom.coursesTableBody.appendChild(row);
    });
  }

  // ==========================================================================
  // Filter & Search Logic
  // ==========================================================================

  function getFilteredCourses() {
    const q = state.searchQuery.trim().toLowerCase();
    if (!q) return state.courses;

    return state.courses.filter(c => {
      return (
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.lecturer && c.lecturer.toLowerCase().includes(q)) ||
        (c.venue && c.venue.toLowerCase().includes(q)) ||
        (c.day && c.day.toLowerCase().includes(q)) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    });
  }

  function updateBadgeCounts() {
    const currentDay = getCurrentDayName();
    const todayCourses = state.courses.filter(c => c.day === currentDay);
    dom.todayBadgeCount.textContent = todayCourses.length;
    dom.totalCoursesBadge.textContent = state.courses.length;
  }

  function refreshAllViews() {
    updateBadgeCounts();
    if (state.currentView === 'weekly') {
      renderWeeklyGrid();
    } else if (state.currentView === 'agenda') {
      renderAgendaDayPicker();
      renderAgendaTimeline();
    } else if (state.currentView === 'directory') {
      renderCourseDirectory();
    }
  }

  // ==========================================================================
  // Switch Active Views
  // ==========================================================================

  function setView(viewName) {
    state.currentView = viewName;

    // Tabs state
    dom.tabWeekly.classList.toggle('active', viewName === 'weekly');
    dom.tabAgenda.classList.toggle('active', viewName === 'agenda');
    dom.tabDirectory.classList.toggle('active', viewName === 'directory');

    dom.tabWeekly.setAttribute('aria-selected', viewName === 'weekly');
    dom.tabAgenda.setAttribute('aria-selected', viewName === 'agenda');
    dom.tabDirectory.setAttribute('aria-selected', viewName === 'directory');

    // Panels state
    dom.weeklyViewPanel.classList.toggle('active', viewName === 'weekly');
    dom.agendaViewPanel.classList.toggle('active', viewName === 'agenda');
    dom.directoryViewPanel.classList.toggle('active', viewName === 'directory');

    refreshAllViews();
  }

  // ==========================================================================
  // Modal Handlers (Add, Edit, Detail)
  // ==========================================================================

  function openAddCourseModal(defaultDay = null) {
    state.editingCourseId = null;
    dom.modalTitle.textContent = 'Add New Class';
    dom.courseForm.reset();
    dom.courseId.value = '';

    dom.courseDay.value = defaultDay || getCurrentDayName();
    dom.startTime.value = '09:00';
    dom.endTime.value = '10:30';

    // Clear error states
    dom.courseNameError.textContent = '';
    dom.lecturerNameError.textContent = '';
    dom.venueNameError.textContent = '';
    dom.startTimeError.textContent = '';
    dom.endTimeError.textContent = '';
    dom.conflictAlert.style.display = 'none';

    // Default color
    selectColor('#3B82F6');

    dom.courseModalBackdrop.classList.add('open');
    dom.courseModalBackdrop.setAttribute('aria-hidden', 'false');
    dom.courseName.focus();
  }

  function openEditCourseModal(courseId) {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;

    state.editingCourseId = courseId;
    dom.modalTitle.textContent = 'Edit Class';
    dom.courseId.value = course.id;
    dom.courseName.value = course.name;
    dom.courseCode.value = course.code || '';
    dom.lecturerName.value = course.lecturer;
    dom.venueName.value = course.venue;
    dom.courseDay.value = course.day;
    dom.startTime.value = course.startTime;
    dom.endTime.value = course.endTime;
    dom.courseNotes.value = course.notes || '';

    // Clear errors
    dom.courseNameError.textContent = '';
    dom.lecturerNameError.textContent = '';
    dom.venueNameError.textContent = '';
    dom.startTimeError.textContent = '';
    dom.endTimeError.textContent = '';

    selectColor(course.color || '#3B82F6');
    validateCourseTimes();

    dom.courseModalBackdrop.classList.add('open');
    dom.courseModalBackdrop.setAttribute('aria-hidden', 'false');
    dom.courseName.focus();
  }

  function closeCourseModal() {
    dom.courseModalBackdrop.classList.remove('open');
    dom.courseModalBackdrop.setAttribute('aria-hidden', 'true');
    state.editingCourseId = null;
  }

  function openCourseDetail(courseId) {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;

    state.activeDetailCourseId = courseId;

    dom.detailColorStrip.style.backgroundColor = course.color || '#3B82F6';
    dom.detailCourseCode.textContent = course.code || 'COURSE';
    dom.detailCourseName.textContent = course.name;
    dom.detailSchedule.textContent = `${course.day}, ${formatTime(course.startTime)} - ${formatTime(course.endTime)}`;
    dom.detailDuration.textContent = formatDuration(course.startTime, course.endTime);
    dom.detailVenue.textContent = course.venue;
    dom.detailLecturer.textContent = course.lecturer;

    if (course.notes && course.notes.trim()) {
      dom.detailNotes.textContent = course.notes;
      dom.detailNotesBox.style.display = 'block';
    } else {
      dom.detailNotesBox.style.display = 'none';
    }

    dom.detailModalBackdrop.classList.add('open');
    dom.detailModalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeDetailModal() {
    dom.detailModalBackdrop.classList.remove('open');
    dom.detailModalBackdrop.setAttribute('aria-hidden', 'true');
    state.activeDetailCourseId = null;
  }

  function selectColor(hexColor) {
    dom.selectedColor.value = hexColor;
    dom.customColorPicker.value = hexColor;

    const chips = dom.colorPalettePicker.querySelectorAll('.color-chip');
    chips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.color.toLowerCase() === hexColor.toLowerCase());
    });
  }

  // ==========================================================================
  // Form Submission & Course Actions
  // ==========================================================================

  function handleCourseFormSubmit(e) {
    e.preventDefault();

    const name = dom.courseName.value.trim();
    const lecturer = dom.lecturerName.value.trim();
    const venue = dom.venueName.value.trim();
    const day = dom.courseDay.value;
    const startTime = dom.startTime.value;
    const endTime = dom.endTime.value;
    const code = dom.courseCode.value.trim();
    const notes = dom.courseNotes.value.trim();
    const color = dom.selectedColor.value;
    const id = dom.courseId.value;

    let hasErrors = false;

    if (!name) {
      dom.courseNameError.textContent = 'Please enter a course name';
      hasErrors = true;
    } else {
      dom.courseNameError.textContent = '';
    }

    if (!lecturer) {
      dom.lecturerNameError.textContent = 'Please enter lecturer or professor';
      hasErrors = true;
    } else {
      dom.lecturerNameError.textContent = '';
    }

    if (!venue) {
      dom.venueNameError.textContent = 'Please enter room or venue';
      hasErrors = true;
    } else {
      dom.venueNameError.textContent = '';
    }

    if (!validateCourseTimes()) {
      hasErrors = true;
    }

    if (hasErrors) return;

    if (id) {
      // Update existing course
      const index = state.courses.findIndex(c => c.id === id);
      if (index !== -1) {
        state.courses[index] = {
          ...state.courses[index],
          name,
          code,
          lecturer,
          venue,
          day,
          startTime,
          endTime,
          color,
          notes
        };
        showToast(`Updated "${name}"`, 'success');
      }
    } else {
      // Create new course
      const newCourse = {
        id: generateId(),
        name,
        code,
        lecturer,
        venue,
        day,
        startTime,
        endTime,
        color,
        notes
      };
      state.courses.push(newCourse);
      showToast(`Added "${name}" to schedule`, 'success');

      // Auto-enable weekend view if scheduled on weekend
      if ((day === 'Saturday' || day === 'Sunday') && !state.showWeekends) {
        state.showWeekends = true;
        dom.weekendToggle.checked = true;
        localStorage.setItem(WEEKEND_KEY, 'true');
      }
    }

    saveCourses();
    closeCourseModal();
    refreshAllViews();
  }

  function deleteCourse(courseId) {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;

    if (confirm(`Are you sure you want to remove "${course.name}" from your timetable?`)) {
      state.courses = state.courses.filter(c => c.id !== courseId);
      saveCourses();
      closeDetailModal();
      refreshAllViews();
      showToast(`Removed "${course.name}"`, 'info');
    }
  }

  // ==========================================================================
  // Demo Data & Import / Export
  // ==========================================================================

  function loadDemoSchedule() {
    if (confirm('Load demo university timetable? This will populate standard weekly classes.')) {
      state.courses = JSON.parse(JSON.stringify(SAMPLE_COURSES));
      saveCourses();
      refreshAllViews();
      showToast('Demo university timetable loaded!', 'success');
    }
  }

  function exportToJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.courses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `unischedule_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Schedule exported as JSON', 'success');
  }

  function importFromJson(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          state.courses = imported;
          saveCourses();
          refreshAllViews();
          showToast(`Successfully imported ${imported.length} classes!`, 'success');
        } else {
          showToast('Invalid schedule JSON file format', 'error');
        }
      } catch (err) {
        showToast('Error parsing JSON file', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be reloaded if needed
    e.target.value = '';
  }

  function clearAllCourses() {
    if (confirm('Are you sure you want to delete ALL courses from your timetable? This cannot be undone.')) {
      state.courses = [];
      saveCourses();
      refreshAllViews();
      showToast('Timetable cleared', 'info');
    }
  }

  // ==========================================================================
  // Event Listeners Setup
  // ==========================================================================

  function initEventListeners() {
    // Navigation Tabs
    dom.tabWeekly.addEventListener('click', () => setView('weekly'));
    dom.tabAgenda.addEventListener('click', () => setView('agenda'));
    dom.tabDirectory.addEventListener('click', () => setView('directory'));

    // Header buttons
    dom.addCourseBtn.addEventListener('click', () => openAddCourseModal());
    dom.emptyAddBtn.addEventListener('click', () => openAddCourseModal());
    dom.demoDataBtn.addEventListener('click', loadDemoSchedule);
    dom.printBtn.addEventListener('click', () => window.print());
    dom.themeToggleBtn.addEventListener('click', toggleTheme);

    // Weekend toggle
    dom.weekendToggle.addEventListener('change', (e) => {
      state.showWeekends = e.target.checked;
      localStorage.setItem(WEEKEND_KEY, state.showWeekends ? 'true' : 'false');
      refreshAllViews();
    });

    // Search input
    dom.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      dom.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      refreshAllViews();
    });

    dom.clearSearchBtn.addEventListener('click', () => {
      dom.searchInput.value = '';
      state.searchQuery = '';
      dom.clearSearchBtn.style.display = 'none';
      refreshAllViews();
    });

    // Directory actions
    dom.exportJsonBtn.addEventListener('click', exportToJson);
    dom.importJsonInput.addEventListener('change', importFromJson);
    dom.clearAllBtn.addEventListener('click', clearAllCourses);

    // Form submission & inputs
    dom.courseForm.addEventListener('submit', handleCourseFormSubmit);
    dom.startTime.addEventListener('change', validateCourseTimes);
    dom.endTime.addEventListener('change', validateCourseTimes);
    dom.courseDay.addEventListener('change', validateCourseTimes);

    // Color chips
    dom.colorPalettePicker.addEventListener('click', (e) => {
      const chip = e.target.closest('.color-chip');
      if (chip) {
        selectColor(chip.dataset.color);
      }
    });

    dom.customColorPicker.addEventListener('input', (e) => {
      selectColor(e.target.value);
    });

    // Modal Close buttons
    dom.closeModalBtn.addEventListener('click', closeCourseModal);
    dom.cancelModalBtn.addEventListener('click', closeCourseModal);
    dom.courseModalBackdrop.addEventListener('click', (e) => {
      if (e.target === dom.courseModalBackdrop) closeCourseModal();
    });

    // Detail Modal actions
    dom.closeDetailModalBtn.addEventListener('click', closeDetailModal);
    dom.detailModalBackdrop.addEventListener('click', (e) => {
      if (e.target === dom.detailModalBackdrop) closeDetailModal();
    });

    dom.detailEditBtn.addEventListener('click', () => {
      const id = state.activeDetailCourseId;
      closeDetailModal();
      openEditCourseModal(id);
    });

    dom.detailDeleteBtn.addEventListener('click', () => {
      if (state.activeDetailCourseId) {
        deleteCourse(state.activeDetailCourseId);
      }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        if (dom.courseModalBackdrop.classList.contains('open')) {
          closeCourseModal();
        }
        if (dom.detailModalBackdrop.classList.contains('open')) {
          closeDetailModal();
        }
      }

      // 'N' shortcut to add course when not typing inside an input/textarea
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (e.key === 'n' && tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
        if (!dom.courseModalBackdrop.classList.contains('open') && !dom.detailModalBackdrop.classList.contains('open')) {
          e.preventDefault();
          openAddCourseModal();
        }
      }
    });
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================

  function init() {
    loadState();
    initEventListeners();
    setView('weekly');
  }

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
