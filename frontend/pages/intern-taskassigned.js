// =================================================================
//  intern-taskassigned.js  — FINAL VERSION with populateFinalCard
// =================================================================

const BASE_URL = 'http://localhost:3000';
const token    = localStorage.getItem('token');
const internId = localStorage.getItem('internId');

if (!token) window.location.href = 'auth.html';

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// -----------------------------------------------------------------
//  INIT — load tasks on page ready
// -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', loadTasks);

// -----------------------------------------------------------------
//  LOAD ALL TASKS FROM DB
// -----------------------------------------------------------------
async function loadTasks() {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks/intern/${internId}`, {
      headers: AUTH_HEADERS
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tasks = await res.json();

    populateFinalCard(tasks);   // fill the pinned card from DB
    renderTasks(tasks);         // render regular task cards
  } catch (err) {
    console.error('Failed to load tasks:', err);
    showToast('❌ Could not load tasks. Is the server running?');
    // Fallback: show empty state
    document.getElementById('taskContainer').innerHTML =
      `<div style="text-align:center;padding:40px;color:var(--muted);font-family:'Syne';">Could not load tasks.</div>`;
  }
}

// -----------------------------------------------------------------
//  POPULATE FINAL CARD from the is_final=1 task in DB
// -----------------------------------------------------------------
function populateFinalCard(tasks) {
  const finalTask = tasks.find(t => t.is_final == 1 || t.is_final === true);
  if (!finalTask) return;

  // Store task ID on button for the PUT call
  const btn = document.getElementById('finalCompleteBtn');
  if (btn) btn.dataset.taskId = finalTask.id;

  // Title
  const titleEl = document.getElementById('finalTitle');
  if (titleEl) titleEl.textContent = finalTask.title;

  // Description
  const descEl = document.getElementById('finalDesc');
  if (descEl) descEl.textContent = finalTask.description;

  // Deliverables
  const deliverables = safeList(finalTask.deliverables);
  const delEl = document.getElementById('finalDeliverables');
  if (delEl && deliverables.length) {
    delEl.innerHTML = `
      <div class="detail-block">
        <span class="detail-title">Key Deliverables</span>
        <ul class="req-list">${deliverables.map(d => `<li>${d}</li>`).join('')}</ul>
      </div>`;
  }

  // Tech stack / expectations
  const expectations = safeList(finalTask.expectations);
  const expEl = document.getElementById('finalExpectations');
  if (expEl && expectations.length) {
    expEl.innerHTML = `
      <div class="detail-block">
        <span class="detail-title">Tech Stack</span>
        <ul class="req-list">${expectations.map(e => `<li>${e}</li>`).join('')}</ul>
      </div>`;
  }

  // Notes / mindful
  const notes = safeList(finalTask.notes);
  const notesEl = document.getElementById('finalNotes');
  if (notesEl && notes.length) {
    notesEl.innerHTML = `
      <div class="detail-block">
        <span class="detail-title">Things to be mindful about</span>
        <ul class="req-list">${notes.map(n => `<li>${n}</li>`).join('')}</ul>
      </div>`;
  }

  // Dates
  const assignedEl = document.getElementById('finalAssigned');
  const dueEl      = document.getElementById('finalDue');
  if (assignedEl) assignedEl.textContent = formatDate(finalTask.created_at);
  if (dueEl)      dueEl.textContent      = formatDate(finalTask.due_date);

  // Start live countdown using actual DB deadline
  if (finalTask.status !== 'completed') {
    startCountdown(finalTask.due_date);
  }

  // If already completed in DB, apply completed UI immediately
  if (finalTask.status === 'completed') {
    applyFinalCompleted();
  }
}

// -----------------------------------------------------------------
//  HELPERS
// -----------------------------------------------------------------
function safeList(val) {
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val) || []; } catch { return val ? [val] : []; }
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function getPriority(deadline) {
  const diff = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (diff <= 2) return { label: 'High Priority',   cls: 'badge-high'   };
  if (diff <= 7) return { label: 'Medium Priority', cls: 'badge-medium' };
  return          { label: 'Low Priority',   cls: 'badge-low'   };
}

function getStatusCls(s) {
  if (s === 'completed')   return 'badge-status';
  if (s === 'in_progress') return 'badge-status in-progress';
  return 'badge-medium';
}

function getStatusLabel(s) {
  if (s === 'completed')   return 'Completed';
  if (s === 'in_progress') return 'In Progress';
  return 'Pending';
}

// -----------------------------------------------------------------
//  RENDER REGULAR TASK CARDS (excludes is_final)
// -----------------------------------------------------------------
function renderTasks(tasks) {
  const container = document.getElementById('taskContainer');
  container.innerHTML = '';

  const regularTasks = tasks.filter(t => !t.is_final);

  if (!regularTasks.length) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);font-family:'Syne';">No other tasks assigned yet.</div>`;
    return;
  }

  regularTasks.forEach(task => {
    const pr           = getPriority(task.due_date);
    const due          = formatDate(task.due_date);
    const assigned     = formatDate(task.created_at);
    const deliverables = safeList(task.deliverables);
    const expectations = safeList(task.expectations);
    const notes        = safeList(task.notes);

    const div      = document.createElement('div');
    div.className  = 'task-card';
    div.dataset.id = task.id;

    div.innerHTML = `
      <div class="task-top">
        <div class="task-title">${task.title}</div>
        <div class="badge-row">
          <span class="badge ${getStatusCls(task.status)}" id="status-badge-${task.id}">${getStatusLabel(task.status)}</span>
          <span class="badge ${pr.cls}">${pr.label}</span>
        </div>
      </div>

      <div class="detail-block">
        <span class="detail-title">Task Overview</span>
        <p class="task-desc">${task.description}</p>
      </div>

      ${deliverables.length ? `
      <div class="detail-block">
        <span class="detail-title">Key Deliverables</span>
        <ul class="req-list">${deliverables.map(d => `<li>${d}</li>`).join('')}</ul>
      </div>` : ''}

      ${expectations.length ? `
      <div class="detail-block">
        <span class="detail-title">Software to use</span>
        <ul class="req-list">${expectations.map(e => `<li>${e}</li>`).join('')}</ul>
      </div>` : ''}

      ${notes.length ? `
      <div class="detail-block">
        <span class="detail-title">Things to be mindful about</span>
        <ul class="req-list">${notes.map(n => `<li>${n}</li>`).join('')}</ul>
      </div>` : ''}

      <div class="task-dates">
        <div><span class="date-label">Date Assigned</span><span class="date-value">${assigned}</span></div>
        <div><span class="date-label">Target Deadline</span><span class="date-value">${due}</span></div>
      </div>

      ${task.status !== 'completed' ? `
      <div id="btn-row-${task.id}" style="margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.06);">
        <button onclick="markTaskComplete(${task.id})"
          style="width:100%;padding:10px;border-radius:24px;background:#d9a441;color:#1a1d0f;font-family:'Syne';font-weight:700;font-size:12px;cursor:pointer;border:2px solid transparent;transition:all .25s;">
          Mark Complete
        </button>
      </div>` : `
      <div style="margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.06);text-align:center;font-family:'Syne';font-size:12px;color:#2dd4bf;font-weight:700;">
        ✓ Completed
      </div>`}
    `;

    container.appendChild(div);
  });

  document.querySelectorAll('.task-card').forEach((c, i) => {
    setTimeout(() => c.classList.add('visible'), 100 + i * 120);
  });
}

// -----------------------------------------------------------------
//  MARK REGULAR TASK COMPLETE → PUT /api/tasks/status/:id
// -----------------------------------------------------------------
async function markTaskComplete(taskId) {
  const btnRow = document.getElementById(`btn-row-${taskId}`);
  const btn    = btnRow ? btnRow.querySelector('button') : null;
  const badge  = document.getElementById(`status-badge-${taskId}`);

  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  try {
    const res = await fetch(`${BASE_URL}/api/tasks/status/${taskId}`, {
      method:  'PUT',
      headers: AUTH_HEADERS,
      body:    JSON.stringify({ status: 'completed' })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Update badge
    if (badge) {
      badge.textContent      = 'Completed';
      badge.className        = 'badge badge-status';
      badge.style.background = 'rgba(45,212,191,.12)';
      badge.style.color      = '#2dd4bf';
      badge.style.border     = '1px solid rgba(45,212,191,.3)';
    }

    // Swap button to ✓ text
    if (btnRow) {
      btnRow.innerHTML = `<div style="text-align:center;font-family:'Syne';font-size:12px;color:#2dd4bf;font-weight:700;">✓ Completed</div>`;
    }

    showToast('🎉 Task marked as complete!');

  } catch (err) {
    console.error('markTaskComplete error:', err);
    if (btn) { btn.disabled = false; btn.textContent = 'Mark Complete'; }
    showToast('❌ Failed to save. Try again.');
  }
}

// -----------------------------------------------------------------
//  MARK FINAL PROJECT COMPLETE → PUT /api/tasks/status/:id
// -----------------------------------------------------------------
async function completeFinalProject() {
  const btn    = document.getElementById('finalCompleteBtn');
  const taskId = btn ? btn.dataset.taskId : null;

  if (!taskId) {
    showToast('❌ Task ID not found. Reload the page.');
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  try {
    const res = await fetch(`${BASE_URL}/api/tasks/status/${taskId}`, {
      method:  'PUT',
      headers: AUTH_HEADERS,
      body:    JSON.stringify({ status: 'completed' })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    applyFinalCompleted();
    showToast('🎉 Final project marked as complete!');

  } catch (err) {
    console.error('completeFinalProject error:', err);
    if (btn) { btn.disabled = false; btn.textContent = 'Mark Complete'; }
    showToast('❌ Failed to save. Try again.');
  }
}

// -----------------------------------------------------------------
//  APPLY FINAL COMPLETED UI (on button click OR on page load if done)
// -----------------------------------------------------------------
function applyFinalCompleted() {
  // Stop countdown
  if (window.countdownInterval) clearInterval(window.countdownInterval);

  // Hide button row
  const btnRow = document.getElementById('finalBtnRow');
  if (btnRow) btnRow.style.display = 'none';

  // Swap status badge
  const statusBadge = document.getElementById('finalStatusBadge');
  if (statusBadge) {
    statusBadge.textContent      = 'Completed';
    statusBadge.className        = 'badge badge-status';
    statusBadge.style.background = 'rgba(45,212,191,.12)';
    statusBadge.style.color      = '#2dd4bf';
    statusBadge.style.border     = '1px solid rgba(45,212,191,.3)';
  }

  // Replace countdown with ✓ message
  const strip = document.getElementById('finalCountdown');
  if (strip) {
    strip.style.marginTop  = '18px';
    strip.style.paddingTop = '16px';
    strip.style.borderTop  = '1px solid rgba(45,212,191,.15)';
    strip.innerHTML = `<div style="font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#2dd4bf;text-align:center;width:100%;">✓ Final Project Completed!</div>`;
  }
}

// -----------------------------------------------------------------
//  TOAST
// -----------------------------------------------------------------
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    Object.assign(t.style, {
      position:     'fixed',
      bottom:       '20px',
      right:        '20px',
      background:   'rgba(28,32,16,.97)',
      border:       '1px solid rgba(217,164,65,.3)',
      color:        '#fff',
      padding:      '12px 20px',
      borderRadius: '12px',
      fontSize:     '12px',
      fontFamily:   "'Syne',sans-serif",
      fontWeight:   '700',
      zIndex:       '9999',
      transition:   'opacity .3s',
      opacity:      '0'
    });
    document.body.appendChild(t);
  }
  t.textContent   = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2800);
}