/* submission.js - Handles upload, form submission & history */
const API = 'http://localhost:3000/api';
const BACKEND_ORIGIN = 'http://localhost:3000';

// ── Helpers ───────────────────────────────────────────────
function getInternId() {
  return localStorage.getItem('internId') || localStorage.getItem('userId') || localStorage.getItem('id') || null;
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  const dot = document.getElementById('toastDot');
  const span = document.getElementById('toastMsg');
  span.textContent = msg;
  dot.style.background = isError ? 'var(--red)' : 'var(--green)';
  t.style.borderColor = isError ? 'rgba(255,107,107,.5)' : 'rgba(74,222,128,.4)';
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}
function statusBadge(status) {
  const s = (status || '').toLowerCase();
  if (s === 'on_time') return '<span class="sub-badge badge-approved">On Time</span>';
  if (s === 'late') return '<span class="sub-badge badge-late">Late</span>';
  return '<span class="sub-badge badge-pending">Pending</span>';
}

// ── Elements ──────────────────────────────────────────────
const uploadZone = document.getElementById('uploadZone');
const filePreview = document.getElementById('filePreview');
const uploadText = document.getElementById('uploadText');
const previewName = document.getElementById('previewName');
const previewSize = document.getElementById('previewSize');
let selectedFile = null;

function getFileInput() { return document.getElementById('fileInput'); }

function handleFile(file) {
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pdf','doc','docx'].includes(ext)) {
    showToast('Only PDF or Word (.doc/.docx) files are accepted.', true);
    return;
  }
  selectedFile = file;
  previewName.textContent = file.name;
  previewSize.textContent = fmtSize(file.size);
  filePreview.style.display = 'flex';
  uploadText.innerHTML = `<span>File selected</span> — click to change`;
  uploadZone.style.borderColor = 'rgba(45,212,191,.6)';
  uploadZone.style.background = 'rgba(45,212,191,.06)';
}

function resetUploadZone() {
  selectedFile = null;
  const old = getFileInput();
  const fresh = old.cloneNode(true);
  old.parentNode.replaceChild(fresh, old);
  fresh.addEventListener('change', function () { if (this.files && this.files[0]) handleFile(this.files[0]); });
  filePreview.style.display = 'none';
  previewName.textContent = '';
  previewSize.textContent = '';
  uploadText.innerHTML = `Drag &amp; drop or <span>Browse file</span>`;
  uploadZone.style.borderColor = '';
  uploadZone.style.background = '';
}

// ── Event Listeners ───────────────────────────────────────
uploadZone.addEventListener('click', (e) => { if (!e.target.closest('#removeFile')) getFileInput().click(); });
getFileInput().addEventListener('change', function () { if (this.files && this.files[0]) handleFile(this.files[0]); });

uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone.addEventListener('dragleave', e => { e.preventDefault(); if (!uploadZone.contains(e.relatedTarget)) uploadZone.classList.remove('dragover'); });
uploadZone.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); uploadZone.classList.remove('dragover'); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); });

document.getElementById('removeFile').addEventListener('click', e => { e.stopPropagation(); resetUploadZone(); });

// ── Submit ────────────────────────────────────────────────
const SUBMIT_BTN_HTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Submit Project`;
const LOADING_BTN_HTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;animation:spin .8s linear infinite"><circle cx="12" cy="12" r="10" stroke-opacity=".25"/><path d="M12 2a10 10 0 019.8 8" stroke-linecap="round"/></svg> Submitting…`;

document.getElementById('submitBtn').addEventListener('click', async () => {
  const internId = getInternId();
  if (!internId || internId === 'null' || internId === 'undefined') return showToast('Please log in as an intern first.', true);

  const taskName = document.getElementById('taskName').value.trim();
  const githubUrl = document.getElementById('githubUrl').value.trim();
  if (!taskName) return showToast('Please enter a task / project name.', true);
  if (!selectedFile && !githubUrl) return showToast('Please upload a file or provide a GitHub link.', true);

  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.innerHTML = LOADING_BTN_HTML;

  try {
    const fd = new FormData();
    fd.append('intern_id', internId);
    fd.append('task_name', taskName);
    fd.append('github_url', githubUrl || '');
    if (selectedFile) fd.append('file', selectedFile);

    const res = await fetch(`${API}/submissions/submit`, { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed.');

    showToast('Project submitted successfully! 🎉');
    prependHistoryRow(data.submission);
    document.getElementById('taskName').value = '';
    document.getElementById('githubUrl').value = '';
    resetUploadZone();
  } catch (e) {
    showToast(e.message || 'Network error. Is the server running?', true);
  } finally {
    btn.disabled = false; btn.innerHTML = SUBMIT_BTN_HTML;
  }
});

// ── History ───────────────────────────────────────────────
async function loadHistory() {
  const internId = getInternId();
  const tbody = document.getElementById('historyTbody');
  if (!internId || internId === 'null') { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:36px;">Log in to view history.</td></tr>`; return; }

  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:36px;">Loading…</td></tr>`;
  try {
    const res = await fetch(`${API}/submissions/intern/${internId}`);
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:36px;">No submissions yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map(r => buildRow(r)).join('');
    attachFeedbackListeners();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--red);padding:36px;">Failed to load history.</td></tr>`;
  }
}

function buildRow(r) {
  // ✅ Dynamic origin + clean relative path
const fileUrl = r.file_path ? `${BACKEND_ORIGIN}/${r.file_path.replace(/^\.?[\/\\]/, '')}` : null;  let fileCell = fileUrl ? `<a href="${escHtml(fileUrl)}" target="_blank" rel="noopener" class="tbl-btn tbl-btn-view">View File</a>` 
             : r.github_url ? `<a href="${escHtml(r.github_url)}" target="_blank" rel="noopener" class="tbl-btn tbl-btn-view">GitHub</a>` 
             : `<span style="color:var(--muted)">—</span>`;
  
  const fbCell = r.feedback ? `<button class="tbl-btn tbl-btn-fb view-fb-btn" data-fb="${encodeURIComponent(r.feedback)}">View</button>` 
                : `<span style="color:var(--muted)">Awaiting…</span>`;

  return `<tr>
    <td style="font-weight:600;">${escHtml(r.task_name)}</td>
    <td>${fmtDate(r.submitted_at)}</td>
    <td>${statusBadge(r.status)}</td>
    <td>${fileCell}</td>
    <td>${fbCell}</td>
  </tr>`;
}

function prependHistoryRow(r) {
  const tbody = document.getElementById('historyTbody');
  if (tbody.querySelector('td[colspan]')) tbody.innerHTML = '';
  const tr = document.createElement('tr');
  tr.style.cssText = 'opacity:0;transform:translateY(-10px);transition:opacity .45s ease,transform .45s ease;';
  tr.innerHTML = buildRow(r);
  tbody.insertBefore(tr, tbody.firstChild);
  requestAnimationFrame(() => requestAnimationFrame(() => { tr.style.opacity = '1'; tr.style.transform = 'translateY(0)'; }));
  attachFeedbackListeners();
}

function attachFeedbackListeners() {
  document.querySelectorAll('.view-fb-btn').forEach(btn => {
    const fresh = btn.cloneNode(true); btn.replaceWith(fresh);
    fresh.addEventListener('click', () => {
      document.getElementById('feedbackText').textContent = decodeURIComponent(fresh.dataset.fb);
      document.getElementById('feedbackModal').classList.add('open');
    });
  });
}

document.getElementById('modalCloseBtn').addEventListener('click', () => document.getElementById('feedbackModal').classList.remove('open'));
document.getElementById('feedbackModal').addEventListener('click', function(e) { if (e.target === this) this.classList.remove('open'); });

// Boot
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadHistory);
else loadHistory();