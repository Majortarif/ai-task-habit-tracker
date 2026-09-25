/* ==========================================================
   Pulse — AI-Assisted Task & Habit Tracker
   Vanilla JS application logic (no frameworks, no backend)
   ========================================================== */

(function () {
  'use strict';

  /* ==========================================================
     1. STORAGE KEYS & STATE
     ========================================================== */
  const STORAGE_KEYS = {
    tasks: 'pulse_tasks',
    habits: 'pulse_habits',
    theme: 'pulse_theme',
    seeded: 'pulse_seeded'
  };

  let state = {
    tasks: [],
    habits: [],
    theme: 'dark'
  };

  /* ==========================================================
     2. UTILITIES
     ========================================================== */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function todayISO() {
    const d = new Date();
    return formatISO(d);
  }

  function formatISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function addDays(dateStr, n) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return formatISO(d);
  }

  function daysBetween(a, b) {
    const d1 = new Date(a + 'T00:00:00');
    const d2 = new Date(b + 'T00:00:00');
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  }

  // Escape user content to prevent XSS when injected via innerHTML
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDateHuman(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /* ==========================================================
     3. LOCALSTORAGE PERSISTENCE
     ========================================================== */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(state.tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
      showToast('Could not save tasks — storage may be full.', 'error');
    }
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.tasks);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Validate and sanitize each task shape
      return parsed.filter(t => t && typeof t === 'object' && typeof t.id === 'string').map(t => ({
        id: t.id,
        title: typeof t.title === 'string' ? t.title : 'Untitled task',
        description: typeof t.description === 'string' ? t.description : '',
        priority: ['low', 'medium', 'high'].includes(t.priority) ? t.priority : 'medium',
        dueDate: typeof t.dueDate === 'string' ? t.dueDate : '',
        completed: !!t.completed,
        createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now()
      }));
    } catch (e) {
      console.error('Corrupt task data, resetting.', e);
      return [];
    }
  }

  function saveHabits() {
    try {
      localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(state.habits));
    } catch (e) {
      console.error('Failed to save habits', e);
      showToast('Could not save habits — storage may be full.', 'error');
    }
  }

  function loadHabits() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.habits);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(h => h && typeof h === 'object' && typeof h.id === 'string').map(h => ({
        id: h.id,
        name: typeof h.name === 'string' ? h.name : 'Untitled habit',
        icon: typeof h.icon === 'string' ? h.icon : 'fa-star',
        completedDates: Array.isArray(h.completedDates) ? h.completedDates.filter(d => typeof d === 'string') : [],
        createdAt: typeof h.createdAt === 'number' ? h.createdAt : Date.now()
      }));
    } catch (e) {
      console.error('Corrupt habit data, resetting.', e);
      return [];
    }
  }

  function saveTheme() {
    try { localStorage.setItem(STORAGE_KEYS.theme, state.theme); } catch (e) { console.error(e); }
  }

  function loadTheme() {
    try {
      const t = localStorage.getItem(STORAGE_KEYS.theme);
      return (t === 'light' || t === 'dark') ? t : 'dark';
    } catch (e) { return 'dark'; }
  }

  /* ==========================================================
     4. DEMO DATA (first visit only)
     ========================================================== */
  function seedDemoData() {
    const alreadySeeded = localStorage.getItem(STORAGE_KEYS.seeded);
    if (alreadySeeded) return;

    const now = Date.now();
    const today = todayISO();

    state.tasks = [
      { id: uid(), title: 'Complete ML project documentation', description: 'Write up the methodology and results section.', priority: 'high', dueDate: today, completed: false, createdAt: now - 5000 },
      { id: uid(), title: 'Review JavaScript fundamentals', description: 'Closures, async/await, and the event loop.', priority: 'medium', dueDate: addDays(today, 2), completed: false, createdAt: now - 4000 },
      { id: uid(), title: 'Prepare GitHub README', description: '', priority: 'low', dueDate: addDays(today, 5), completed: true, createdAt: now - 3000 },
      { id: uid(), title: 'Practice SQL queries', description: 'Focus on JOINs and window functions.', priority: 'medium', dueDate: addDays(today, -1), completed: false, createdAt: now - 2000 }
    ];

    const y1 = addDays(today, -1);
    const y2 = addDays(today, -2);
    const y3 = addDays(today, -3);

    state.habits = [
      { id: uid(), name: 'Read for 20 minutes', icon: 'fa-book-open', completedDates: [y2, y1], createdAt: now - 5000 },
      { id: uid(), name: 'Exercise', icon: 'fa-dumbbell', completedDates: [y3, y2, y1, today], createdAt: now - 4000 },
      { id: uid(), name: 'Practice coding', icon: 'fa-code', completedDates: [y1], createdAt: now - 3000 },
      { id: uid(), name: 'Study Machine Learning', icon: 'fa-brain', completedDates: [], createdAt: now - 2000 }
    ];

    saveTasks();
    saveHabits();
    localStorage.setItem(STORAGE_KEYS.seeded, 'true');
  }

  /* ==========================================================
     5. STREAK CALCULATION
     ========================================================== */
  function calculateStreaks(completedDates) {
    if (!completedDates || completedDates.length === 0) {
      return { current: 0, best: 0 };
    }
    const uniqueSorted = [...new Set(completedDates)].sort();
    const today = todayISO();
    const yesterday = addDays(today, -1);

    // Best streak: scan chronologically for longest consecutive run
    let best = 1;
    let run = 1;
    for (let i = 1; i < uniqueSorted.length; i++) {
      if (daysBetween(uniqueSorted[i - 1], uniqueSorted[i]) === 1) {
        run++;
      } else {
        run = 1;
      }
      if (run > best) best = run;
    }

    // Current streak: must include today or yesterday to still be "alive"
    const lastDate = uniqueSorted[uniqueSorted.length - 1];
    let current = 0;
    if (lastDate === today || lastDate === yesterday) {
      current = 1;
      for (let i = uniqueSorted.length - 1; i > 0; i--) {
        if (daysBetween(uniqueSorted[i - 1], uniqueSorted[i]) === 1) {
          current++;
        } else {
          break;
        }
      }
    }

    return { current, best };
  }

  function habitCompletionRate(habit) {
    if (!habit.createdAt) return 0;
    const createdDate = formatISO(new Date(habit.createdAt));
    const daysSinceCreation = Math.max(1, daysBetween(createdDate, todayISO()) + 1);
    const uniqueDates = new Set(habit.completedDates);
    return Math.round((uniqueDates.size / daysSinceCreation) * 100);
  }

  function isHabitDoneToday(habit) {
    return habit.completedDates.includes(todayISO());
  }

  function getBestOverallStreak() {
    let best = 0;
    state.habits.forEach(h => {
      const { best: b } = calculateStreaks(h.completedDates);
      if (b > best) best = b;
    });
    return best;
  }

  function getBestCurrentStreak() {
    let cur = 0;
    state.habits.forEach(h => {
      const { current: c } = calculateStreaks(h.completedDates);
      if (c > cur) cur = c;
    });
    return cur;
  }

  /* ==========================================================
     6. STATISTICS
     ========================================================== */
  function getTaskStats() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    const active = total - completed;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const highPriorityActive = state.tasks.filter(t => !t.completed && t.priority === 'high').length;
    const overdue = state.tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayISO()).length;
    return { total, completed, active, rate, highPriorityActive, overdue };
  }

  function getHabitStats() {
    const total = state.habits.length;
    const doneToday = state.habits.filter(isHabitDoneToday).length;
    const todayRate = total === 0 ? 0 : Math.round((doneToday / total) * 100);
    return { total, doneToday, todayRate };
  }

  /* ==========================================================
     7. RENDERING — DASHBOARD
     ========================================================== */
  function renderDashboard() {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';
    document.getElementById('greeting').textContent = `${greeting} 👋`;

    document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const taskStats = getTaskStats();
    const habitStats = getHabitStats();

    document.getElementById('statTotalTasks').textContent = taskStats.total;
    document.getElementById('statActiveTasks').textContent = taskStats.active;
    document.getElementById('statCompletedTasks').textContent = taskStats.completed;

    document.getElementById('completionPct').textContent = `${taskStats.rate}%`;
    const circumference = 2 * Math.PI * 15.5;
    const offset = circumference - (taskStats.rate / 100) * circumference;
    document.getElementById('completionRing').style.strokeDasharray = circumference.toFixed(1);
    document.getElementById('completionRing').style.strokeDashoffset = offset.toFixed(1);

    document.getElementById('statHabitsDone').textContent = habitStats.doneToday;
    document.getElementById('statHabitsTotal').textContent = habitStats.total;
    document.getElementById('habitsBar').style.width = `${habitStats.todayRate}%`;

    document.getElementById('statCurrentStreak').textContent = getBestCurrentStreak();
    document.getElementById('statBestStreak').textContent = getBestOverallStreak();

    const messages = [
      'Small consistent steps beat big irregular bursts.',
      'Progress compounds — keep showing up.',
      'One focused task moves the needle more than five scattered ones.',
      "You don't need a perfect day, just a productive one.",
      'Momentum is built one check-in at a time.'
    ];
    document.getElementById('motivationLine').textContent = messages[new Date().getDate() % messages.length];
  }

  /* ==========================================================
     8. RENDERING — TASKS
     ========================================================== */
  function getFilteredSortedTasks() {
    const search = document.getElementById('taskSearch').value.trim().toLowerCase();
    const status = document.getElementById('filterStatus').value;
    const priority = document.getElementById('filterPriority').value;
    const due = document.getElementById('filterDue').value;
    const sort = document.getElementById('sortTasks').value;
    const today = todayISO();
    const weekEnd = addDays(today, 7);

    let list = state.tasks.filter(t => {
      if (search && !t.title.toLowerCase().includes(search) && !t.description.toLowerCase().includes(search)) return false;
      if (status === 'active' && t.completed) return false;
      if (status === 'completed' && !t.completed) return false;
      if (priority !== 'all' && t.priority !== priority) return false;
      if (due === 'overdue' && !(t.dueDate && t.dueDate < today && !t.completed)) return false;
      if (due === 'today' && t.dueDate !== today) return false;
      if (due === 'week' && !(t.dueDate && t.dueDate >= today && t.dueDate <= weekEnd)) return false;
      if (due === 'none' && t.dueDate) return false;
      return true;
    });

    const priorityRank = { high: 0, medium: 1, low: 2 };
    list.sort((a, b) => {
      switch (sort) {
        case 'oldest': return a.createdAt - b.createdAt;
        case 'priority': return priorityRank[a.priority] - priorityRank[b.priority];
        case 'due':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        case 'newest':
        default: return b.createdAt - a.createdAt;
      }
    });

    return list;
  }

  function renderTasks() {
    const list = getFilteredSortedTasks();
    const container = document.getElementById('taskList');
    const emptyState = document.getElementById('taskEmptyState');
    const today = todayISO();

    if (list.length === 0) {
      container.innerHTML = '';
      emptyState.classList.remove('hidden');
      const hasAnyTasks = state.tasks.length > 0;
      emptyState.innerHTML = hasAnyTasks
        ? `<i class="fa-solid fa-filter-circle-xmark text-2xl mb-3"></i><p class="font-medium">No tasks match your filters</p><p class="text-sm mt-1">Try adjusting your search or filters.</p>`
        : `<i class="fa-solid fa-clipboard-check text-2xl mb-3"></i><p class="font-medium">No tasks yet</p><p class="text-sm mt-1">Add your first task to get started.</p>`;
      return;
    }
    emptyState.classList.add('hidden');

    container.innerHTML = list.map(task => {
      const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
      const dueLabel = task.dueDate ? formatDateHuman(task.dueDate) : '';
      return `
      <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <button class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle" data-id="${task.id}" aria-label="${task.completed ? 'Mark as active' : 'Mark as completed'}">
          ${task.completed ? '<i class="fa-solid fa-check"></i>' : ''}
        </button>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h4 class="task-title font-semibold text-sm sm:text-base">${escapeHTML(task.title)}</h4>
            <span class="badge badge-${task.priority}">${task.priority}</span>
            ${isOverdue ? '<span class="badge badge-high"><i class="fa-solid fa-clock text-[10px]"></i> overdue</span>' : ''}
          </div>
          ${task.description ? `<p class="text-xs sm:text-sm text-base-500 dark:text-base-400 mb-1.5">${escapeHTML(task.description)}</p>` : ''}
          ${dueLabel ? `<p class="text-xs text-base-400 dark:text-base-500"><i class="fa-regular fa-calendar mr-1"></i>${dueLabel}</p>` : ''}
        </div>
        <div class="flex items-center gap-1">
          <button class="icon-btn" data-action="edit" data-id="${task.id}" aria-label="Edit task"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-btn danger" data-action="delete" data-id="${task.id}" aria-label="Delete task"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
    }).join('');
  }

  /* ==========================================================
     9. RENDERING — HABITS
     ========================================================== */
  function renderWeekStrip(habit) {
    const days = [];
    const today = todayISO();
    for (let i = 6; i >= 0; i--) {
      const dateStr = addDays(today, -i);
      const d = new Date(dateStr + 'T00:00:00');
      const label = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      const done = habit.completedDates.includes(dateStr);
      const isToday = dateStr === today;
      days.push(`<div class="flex flex-col items-center gap-1">
        <span class="week-dot ${done ? 'done' : ''} ${isToday ? 'today' : ''}">${done ? '<i class="fa-solid fa-check text-[9px]"></i>' : label}</span>
      </div>`);
    }
    return days.join('');
  }

  function renderHabits() {
    const container = document.getElementById('habitList');
    const emptyState = document.getElementById('habitEmptyState');

    if (state.habits.length === 0) {
      container.innerHTML = '';
      emptyState.classList.remove('hidden');
      emptyState.innerHTML = `<i class="fa-solid fa-seedling text-2xl mb-3"></i><p class="font-medium">No habits added yet</p><p class="text-sm mt-1">Start your first habit today.</p>`;
      return;
    }
    emptyState.classList.add('hidden');

    container.innerHTML = state.habits.map(habit => {
      const { current, best } = calculateStreaks(habit.completedDates);
      const doneToday = isHabitDoneToday(habit);
      const rate = habitCompletionRate(habit);
      return `
      <div class="habit-card" data-id="${habit.id}">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-600 dark:text-accent-400 flex items-center justify-center shrink-0">
              <i class="fa-solid ${escapeHTML(habit.icon)}"></i>
            </div>
            <h4 class="font-semibold text-sm truncate">${escapeHTML(habit.name)}</h4>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button class="icon-btn" data-action="edit-habit" data-id="${habit.id}" aria-label="Edit habit"><i class="fa-solid fa-pen text-xs"></i></button>
            <button class="icon-btn danger" data-action="delete-habit" data-id="${habit.id}" aria-label="Delete habit"><i class="fa-solid fa-trash text-xs"></i></button>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 mb-3 text-center">
          <div class="bg-base-50 dark:bg-base-950/50 rounded-lg py-2">
            <p class="text-sm font-bold flex items-center justify-center gap-1"><i class="fa-solid fa-fire text-amber-500 text-xs"></i>${current}</p>
            <p class="text-[10px] text-base-500 dark:text-base-400 mt-0.5">Current</p>
          </div>
          <div class="bg-base-50 dark:bg-base-950/50 rounded-lg py-2">
            <p class="text-sm font-bold">${best}</p>
            <p class="text-[10px] text-base-500 dark:text-base-400 mt-0.5">Best</p>
          </div>
          <div class="bg-base-50 dark:bg-base-950/50 rounded-lg py-2">
            <p class="text-sm font-bold">${rate}%</p>
            <p class="text-[10px] text-base-500 dark:text-base-400 mt-0.5">Rate</p>
          </div>
        </div>

        <div class="flex justify-between mb-3">${renderWeekStrip(habit)}</div>

        <button class="habit-checkin ${doneToday ? 'done' : ''}" data-action="checkin" data-id="${habit.id}">
          ${doneToday ? '<i class="fa-solid fa-check mr-1.5"></i>Checked in today' : '<i class="fa-regular fa-circle mr-1.5"></i>Check in for today'}
        </button>
      </div>`;
    }).join('');
  }

  /* ==========================================================
     10. RENDERING — ANALYTICS
     ========================================================== */
  function renderAnalytics() {
    const taskStats = getTaskStats();
    const habitStats = getHabitStats();

    document.getElementById('anTotalTasks').textContent = taskStats.total;
    document.getElementById('anActiveTasks').textContent = taskStats.active;
    document.getElementById('anCompletedTasks').textContent = taskStats.completed;
    document.getElementById('anHighPriority').textContent = taskStats.highPriorityActive;
    document.getElementById('anCompletionPct').textContent = `${taskStats.rate}%`;
    document.getElementById('anCompletionBar').style.width = `${taskStats.rate}%`;

    document.getElementById('anTotalHabits').textContent = habitStats.total;
    document.getElementById('anTodayHabits').textContent = `${habitStats.todayRate}%`;
    document.getElementById('anCurrentStreak').textContent = getBestCurrentStreak();
    document.getElementById('anBestStreak').textContent = getBestOverallStreak();

    // Weekly overview: combined completion rate per day across all habits
    const today = todayISO();
    const container = document.getElementById('weeklyOverview');
    if (state.habits.length === 0) {
      container.innerHTML = `<p class="col-span-7 text-center text-sm text-base-400 dark:text-base-500 py-4">Add a habit to see your weekly overview.</p>`;
      return;
    }

    let cells = '';
    for (let i = 6; i >= 0; i--) {
      const dateStr = addDays(today, -i);
      const d = new Date(dateStr + 'T00:00:00');
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const doneCount = state.habits.filter(h => h.completedDates.includes(dateStr)).length;
      const total = state.habits.length;
      const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
      const isFuture = dateStr > today;
      cells += `
        <div class="flex flex-col items-center gap-1.5">
          <span class="text-[10px] font-semibold text-base-400 dark:text-base-500 uppercase">${dayLabel}</span>
          <div class="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
            isFuture ? 'bg-base-100 dark:bg-base-900 text-base-300 dark:text-base-700' :
            pct === 100 ? 'bg-accent-500 text-base-950' :
            pct > 0 ? 'bg-accent-500/25 text-accent-700 dark:text-accent-300' :
            'bg-base-100 dark:bg-base-900 text-base-400 dark:text-base-600'
          }">
            ${isFuture ? '—' : `${pct}%`}
          </div>
        </div>`;
    }
    container.innerHTML = cells;
  }

  /* ==========================================================
     11. MASTER RENDER
     ========================================================== */
  function renderAll() {
    renderDashboard();
    renderTasks();
    renderHabits();
    renderAnalytics();
  }

  /* ==========================================================
     12. TASK CRUD
     ========================================================== */
  function openTaskModal(taskId) {
    const overlay = document.getElementById('taskModalOverlay');
    const form = document.getElementById('taskForm');
    form.reset();
    document.getElementById('taskTitleError').classList.add('hidden');

    if (taskId) {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return;
      document.getElementById('taskModalTitle').textContent = 'Edit Task';
      document.getElementById('taskId').value = task.id;
      document.getElementById('taskTitle').value = task.title;
      document.getElementById('taskDescription').value = task.description;
      document.getElementById('taskPriority').value = task.priority;
      document.getElementById('taskDueDate').value = task.dueDate;
    } else {
      document.getElementById('taskModalTitle').textContent = 'Add Task';
      document.getElementById('taskId').value = '';
    }
    overlay.classList.remove('hidden');
    setTimeout(() => document.getElementById('taskTitle').focus(), 50);
  }

  function closeTaskModal() {
    document.getElementById('taskModalOverlay').classList.add('hidden');
  }

  function handleTaskSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;

    if (!title) {
      document.getElementById('taskTitleError').classList.remove('hidden');
      document.getElementById('taskTitle').focus();
      return;
    }
    document.getElementById('taskTitleError').classList.add('hidden');

    if (id) {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.dueDate = dueDate;
      }
      showToast('Task updated', 'success');
    } else {
      state.tasks.unshift({
        id: uid(), title, description, priority, dueDate,
        completed: false, createdAt: Date.now()
      });
      showToast('Task added successfully', 'success');
    }

    saveTasks();
    closeTaskModal();
    renderAll();
  }

  function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveTasks();
    renderAll();
    showToast(task.completed ? 'Task completed 🎉' : 'Task marked active', 'success');
  }

  function deleteTask(id) {
    confirmAction('Delete task?', 'This task will be permanently removed.', () => {
      state.tasks = state.tasks.filter(t => t.id !== id);
      saveTasks();
      renderAll();
      showToast('Task deleted', 'warning');
    });
  }

  /* ==========================================================
     13. HABIT CRUD
     ========================================================== */
  function openHabitModal(habitId) {
    const overlay = document.getElementById('habitModalOverlay');
    const form = document.getElementById('habitForm');
    form.reset();
    document.getElementById('habitNameError').classList.add('hidden');

    if (habitId) {
      const habit = state.habits.find(h => h.id === habitId);
      if (!habit) return;
      document.getElementById('habitModalTitle').textContent = 'Edit Habit';
      document.getElementById('habitId').value = habit.id;
      document.getElementById('habitName').value = habit.name;
      document.getElementById('habitIcon').value = habit.icon;
    } else {
      document.getElementById('habitModalTitle').textContent = 'Add Habit';
      document.getElementById('habitId').value = '';
    }
    overlay.classList.remove('hidden');
    setTimeout(() => document.getElementById('habitName').focus(), 50);
  }

  function closeHabitModal() {
    document.getElementById('habitModalOverlay').classList.add('hidden');
  }

  function handleHabitSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('habitId').value;
    const name = document.getElementById('habitName').value.trim();
    const icon = document.getElementById('habitIcon').value;

    if (!name) {
      document.getElementById('habitNameError').classList.remove('hidden');
      document.getElementById('habitName').focus();
      return;
    }
    document.getElementById('habitNameError').classList.add('hidden');

    if (id) {
      const habit = state.habits.find(h => h.id === id);
      if (habit) {
        habit.name = name;
        habit.icon = icon;
      }
      showToast('Habit updated', 'success');
    } else {
      state.habits.push({ id: uid(), name, icon, completedDates: [], createdAt: Date.now() });
      showToast('Habit added successfully', 'success');
    }

    saveHabits();
    closeHabitModal();
    renderAll();
  }

  function checkInHabit(id) {
    const habit = state.habits.find(h => h.id === id);
    if (!habit) return;
    const today = todayISO();
    if (habit.completedDates.includes(today)) {
      habit.completedDates = habit.completedDates.filter(d => d !== today);
      showToast('Habit unchecked', 'warning');
    } else {
      habit.completedDates.push(today);
      showToast('Habit checked in ✅', 'success');
    }
    saveHabits();
    renderAll();
  }

  function deleteHabit(id) {
    confirmAction('Delete habit?', 'This habit and its history will be permanently removed.', () => {
      state.habits = state.habits.filter(h => h.id !== id);
      saveHabits();
      renderAll();
      showToast('Habit deleted', 'warning');
    });
  }

  /* ==========================================================
     14. AI PRODUCTIVITY COACH (rule-based simulator)
     ========================================================== */
  function generateCoachTips() {
    const taskStats = getTaskStats();
    const habitStats = getHabitStats();
    const currentStreak = getBestCurrentStreak();
    const tips = [];

    if (taskStats.overdue > 0) {
      tips.push({
        icon: 'fa-triangle-exclamation',
        text: `You have ${taskStats.overdue} overdue task${taskStats.overdue > 1 ? 's' : ''}. Consider clearing one overdue item before starting something new.`
      });
    }

    if (taskStats.highPriorityActive > 0) {
      tips.push({
        icon: 'fa-bolt',
        text: `You have ${taskStats.highPriorityActive} high-priority task${taskStats.highPriorityActive > 1 ? 's' : ''} waiting. Focus on your highest-priority task first — try completing one important task before switching contexts.`
      });
    }

    if (taskStats.active === 0 && taskStats.total > 0) {
      tips.push({
        icon: 'fa-champagne-glasses',
        text: "Your task list is clear. This could be a good time to plan tomorrow's priorities."
      });
    }

    if (taskStats.total === 0) {
      tips.push({
        icon: 'fa-flag-checkered',
        text: 'You have no tasks yet. Add a few things you want to get done today to get momentum going.'
      });
    }

    if (currentStreak >= 3) {
      tips.push({
        icon: 'fa-fire',
        text: `Your habit streak is going strong at ${currentStreak} days. Protect that momentum by completing today's check-ins.`
      });
    }

    if (habitStats.total > 0 && habitStats.todayRate < 50) {
      tips.push({
        icon: 'fa-seedling',
        text: taskStats.rate >= 50
          ? 'Your task progress looks good, but your habit consistency could use attention today.'
          : 'Habit check-ins are lagging today. Even one quick check-in keeps your streaks alive.'
      });
    }

    if (taskStats.rate >= 70 && taskStats.total > 0) {
      tips.push({
        icon: 'fa-star',
        text: `Strong work — you're at a ${taskStats.rate}% completion rate. Keep the pace steady rather than rushing.`
      });
    }

    if (habitStats.total > 0 && habitStats.todayRate === 100) {
      tips.push({
        icon: 'fa-medal',
        text: "All habits checked in for today — that's a clean sweep. Nice consistency."
      });
    }

    if (tips.length === 0) {
      tips.push({
        icon: 'fa-lightbulb',
        text: 'Everything looks balanced right now. A good next step is reviewing your priorities for tomorrow.'
      });
    }

    // Shuffle slightly and cap at 4 so it doesn't feel like a static list every time
    return tips.sort(() => Math.random() - 0.5).slice(0, 4);
  }

  function renderCoachTips() {
    const tips = generateCoachTips();
    const container = document.getElementById('coachTips');
    container.innerHTML = tips.map(t => `
      <div class="tip-card">
        <i class="fa-solid ${t.icon} text-accent-500 mb-1.5 block"></i>
        ${escapeHTML(t.text)}
      </div>`).join('');
  }

  function addChatBubble(text, from) {
    const chat = document.getElementById('coachChat');
    const bubble = document.createElement('div');
    bubble.className = from === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai';
    bubble.textContent = text;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }

  function generateCoachAnswer(question) {
    const q = question.toLowerCase();
    const taskStats = getTaskStats();
    const habitStats = getHabitStats();
    const currentStreak = getBestCurrentStreak();
    const bestStreak = getBestOverallStreak();

    // "What should I do first?" — recommend highest priority active task
    if (q.includes('what should i do first') || q.includes('what first') || q.includes('what to do') || q.includes('priorit')) {
      const priorityRank = { high: 0, medium: 1, low: 2 };
      const activeTasks = state.tasks.filter(t => !t.completed)
        .sort((a, b) => {
          const overdueA = a.dueDate && a.dueDate < todayISO() ? -1 : 0;
          const overdueB = b.dueDate && b.dueDate < todayISO() ? -1 : 0;
          if (overdueA !== overdueB) return overdueA - overdueB;
          return priorityRank[a.priority] - priorityRank[b.priority];
        });
      if (activeTasks.length === 0) {
        return "You don't have any active tasks right now — you're all caught up! This is a great time to plan ahead or check in on your habits.";
      }
      const top = activeTasks[0];
      const overdueNote = top.dueDate && top.dueDate < todayISO() ? " It's also overdue, so it's worth tackling first." : '';
      return `Start with "${top.title}" — it's your highest-priority active task (${top.priority} priority).${overdueNote}`;
    }

    // "How are my habits doing?"
    if (q.includes('habit')) {
      if (habitStats.total === 0) {
        return "You haven't added any habits yet. Add one from the Habits section to start building a streak.";
      }
      return `You've checked in on ${habitStats.doneToday} of ${habitStats.total} habits today (${habitStats.todayRate}%). Your best current streak across all habits is ${currentStreak} day${currentStreak === 1 ? '' : 's'}, and your best ever is ${bestStreak}.`;
    }

    // "Give me a plan for today"
    if (q.includes('plan') || q.includes('today')) {
      const activeTasks = state.tasks.filter(t => !t.completed);
      const priorityRank = { high: 0, medium: 1, low: 2 };
      const topThree = [...activeTasks].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]).slice(0, 3);
      const pendingHabits = state.habits.filter(h => !isHabitDoneToday(h));

      let plan = '';
      if (topThree.length > 0) {
        plan += `Focus on these tasks in order: ${topThree.map(t => `"${t.title}"`).join(', then ')}. `;
      } else {
        plan += 'No active tasks to prioritize — nice work staying on top of things. ';
      }
      if (pendingHabits.length > 0) {
        plan += `Then check in on: ${pendingHabits.map(h => h.name).join(', ')}.`;
      } else if (habitStats.total > 0) {
        plan += "All your habits are already checked in for today.";
      }
      return plan.trim();
    }

    // "Why am I falling behind?"
    if (q.includes('falling behind') || q.includes('behind') || q.includes('why')) {
      const reasons = [];
      if (taskStats.overdue > 0) reasons.push(`${taskStats.overdue} overdue task${taskStats.overdue > 1 ? 's' : ''}`);
      if (taskStats.highPriorityActive > 2) reasons.push(`${taskStats.highPriorityActive} unfinished high-priority tasks`);
      if (habitStats.total > 0 && habitStats.todayRate < 50) reasons.push('low habit check-in rate today');
      if (reasons.length === 0) {
        return "You're actually not behind — your tasks and habits look reasonably on track. If it feels that way, it might be worth breaking bigger tasks into smaller ones.";
      }
      return `A few things are likely contributing: ${reasons.join(', ')}. Tackling the overdue or high-priority items first usually helps the most.`;
    }

    // "How can I improve my productivity?"
    if (q.includes('improve') || q.includes('better')) {
      const tips = generateCoachTips();
      return tips[0] ? tips[0].text : 'Try focusing on one task at a time and checking in on your habits daily — consistency compounds.';
    }

    // Fallback — general status summary
    return `Here's where things stand: ${taskStats.active} active task${taskStats.active === 1 ? '' : 's'} (${taskStats.completed} completed so far), and ${habitStats.doneToday}/${habitStats.total} habits checked in today. Ask me things like "what should I do first?" or "give me a plan for today."`;
  }

  function handleCoachSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('coachInput');
    const question = input.value.trim();
    if (!question) return;
    addChatBubble(question, 'user');
    input.value = '';

    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble-ai';
    typingBubble.innerHTML = '<i class="fa-solid fa-ellipsis fa-fade"></i>';
    const chat = document.getElementById('coachChat');
    chat.appendChild(typingBubble);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
      typingBubble.remove();
      addChatBubble(generateCoachAnswer(question), 'ai');
    }, 450);
  }

  /* ==========================================================
     15. THEME MANAGEMENT
     ========================================================== */
  function applyTheme() {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveTheme();
    applyTheme();
  }

  /* ==========================================================
     16. NAVIGATION
     ========================================================== */
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 76;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function setActiveNav(id) {
    document.querySelectorAll('.nav-link').forEach(el => el.classList.toggle('active', el.dataset.nav === id));
    document.querySelectorAll('.nav-link-mobile').forEach(el => el.classList.toggle('active', el.dataset.nav === id));
  }

  function initNavObserver() {
    const sections = ['dashboard', 'tasks', 'habits', 'coach', 'analytics', 'settings'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ==========================================================
     17. TOAST NOTIFICATIONS
     ========================================================== */
  function showToast(message, type = 'success') {
    const icons = { success: 'fa-circle-check', warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark' };
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}"></i><span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('exit');
      setTimeout(() => toast.remove(), 220);
    }, 3000);
  }

  /* ==========================================================
     18. CONFIRM DIALOG
     ========================================================== */
  let confirmCallback = null;

  function confirmAction(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = onConfirm;
    document.getElementById('confirmOverlay').classList.remove('hidden');
  }

  function closeConfirm() {
    document.getElementById('confirmOverlay').classList.add('hidden');
    confirmCallback = null;
  }

  /* ==========================================================
     19. IMPORT / EXPORT / CLEAR DATA
     ========================================================== */
  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'Pulse — AI-Assisted Task & Habit Tracker',
      version: 1,
      tasks: state.tasks,
      habits: state.habits
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-backup-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported', 'success');
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || typeof data !== 'object' || !Array.isArray(data.tasks) || !Array.isArray(data.habits)) {
          throw new Error('Invalid file structure');
        }
        state.tasks = data.tasks.filter(t => t && typeof t === 'object' && typeof t.title === 'string').map(t => ({
          id: typeof t.id === 'string' ? t.id : uid(),
          title: t.title,
          description: typeof t.description === 'string' ? t.description : '',
          priority: ['low', 'medium', 'high'].includes(t.priority) ? t.priority : 'medium',
          dueDate: typeof t.dueDate === 'string' ? t.dueDate : '',
          completed: !!t.completed,
          createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now()
        }));
        state.habits = data.habits.filter(h => h && typeof h === 'object' && typeof h.name === 'string').map(h => ({
          id: typeof h.id === 'string' ? h.id : uid(),
          name: h.name,
          icon: typeof h.icon === 'string' ? h.icon : 'fa-star',
          completedDates: Array.isArray(h.completedDates) ? h.completedDates.filter(d => typeof d === 'string') : [],
          createdAt: typeof h.createdAt === 'number' ? h.createdAt : Date.now()
        }));
        saveTasks();
        saveHabits();
        localStorage.setItem(STORAGE_KEYS.seeded, 'true');
        renderAll();
        showToast('Data imported successfully', 'success');
      } catch (err) {
        console.error('Import failed', err);
        showToast('Import failed — file is not a valid Pulse backup.', 'error');
      }
    };
    reader.onerror = () => showToast('Could not read the selected file.', 'error');
    reader.readAsText(file);
  }

  function clearAllData() {
    confirmAction('Clear all data?', 'This will permanently delete all tasks and habits from this browser. This cannot be undone.', () => {
      state.tasks = [];
      state.habits = [];
      saveTasks();
      saveHabits();
      localStorage.setItem(STORAGE_KEYS.seeded, 'true');
      renderAll();
      showToast('All data cleared', 'warning');
    });
  }

  /* ==========================================================
     20. EVENT LISTENERS
     ========================================================== */
  function initEventListeners() {
    // Navigation
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        scrollToSection(btn.dataset.nav);
        document.getElementById('mobileNav').classList.add('hidden');
      });
    });
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
      document.getElementById('mobileNav').classList.toggle('hidden');
    });

    // Theme
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Task modal
    document.getElementById('openAddTaskBtn').addEventListener('click', () => openTaskModal(null));
    document.getElementById('closeTaskModal').addEventListener('click', closeTaskModal);
    document.getElementById('cancelTaskBtn').addEventListener('click', closeTaskModal);
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    document.getElementById('taskModalOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'taskModalOverlay') closeTaskModal();
    });

    // Habit modal
    document.getElementById('openAddHabitBtn').addEventListener('click', () => openHabitModal(null));
    document.getElementById('closeHabitModal').addEventListener('click', closeHabitModal);
    document.getElementById('cancelHabitBtn').addEventListener('click', closeHabitModal);
    document.getElementById('habitForm').addEventListener('submit', handleHabitSubmit);
    document.getElementById('habitModalOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'habitModalOverlay') closeHabitModal();
    });

    // Confirm dialog
    document.getElementById('confirmCancelBtn').addEventListener('click', closeConfirm);
    document.getElementById('confirmOkBtn').addEventListener('click', () => {
      if (confirmCallback) confirmCallback();
      closeConfirm();
    });
    document.getElementById('confirmOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'confirmOverlay') closeConfirm();
    });

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTaskModal();
        closeHabitModal();
        closeConfirm();
      }
    });

    // Task list delegated actions
    document.getElementById('taskList').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.dataset.action === 'toggle') toggleTask(id);
      if (btn.dataset.action === 'edit') openTaskModal(id);
      if (btn.dataset.action === 'delete') deleteTask(id);
    });

    // Habit list delegated actions
    document.getElementById('habitList').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.dataset.action === 'checkin') checkInHabit(id);
      if (btn.dataset.action === 'edit-habit') openHabitModal(id);
      if (btn.dataset.action === 'delete-habit') deleteHabit(id);
    });

    // Task filters/search/sort
    ['taskSearch', 'filterStatus', 'filterPriority', 'filterDue', 'sortTasks'].forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('input', renderTasks);
      el.addEventListener('change', renderTasks);
    });

    // AI Coach
    document.getElementById('getTipsBtn').addEventListener('click', renderCoachTips);
    document.getElementById('coachForm').addEventListener('submit', handleCoachSubmit);
    document.querySelectorAll('.chip-suggest').forEach(chip => {
      chip.addEventListener('click', () => {
        document.getElementById('coachInput').value = chip.dataset.q;
        document.getElementById('coachForm').dispatchEvent(new Event('submit', { cancelable: true }));
      });
    });

    // Settings
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) importData(file);
      e.target.value = '';
    });
    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
  }

  /* ==========================================================
     21. INIT
     ========================================================== */
  function init() {
    state.theme = loadTheme();
    applyTheme();

    seedDemoData();
    state.tasks = loadTasks();
    state.habits = loadHabits();

    initEventListeners();
    initNavObserver();
    renderAll();

    // Welcome message in coach chat
    addChatBubble("Hi! I'm your productivity coach — ask me what to focus on, or tap a suggestion below.", 'ai');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
