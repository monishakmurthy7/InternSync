/**
 * content.js — InternSync Shared Content Store
 * Mirrors ALL content from intern-content.html into mentor's Content Hub.
 * Seeds on first load; never overwrites if mentor has already made changes.
 */

const CONTENT_KEY = 'mentorContent';

// ── Exact videos from intern-content.html VIDEOS array ──────────────
// Each becomes a 'video' type item in the mentor's uploaded content history.
const DEFAULT_CONTENT = [
  {
    id: 1,
    type: 'video',
    title: 'Introduction to Full Stack Development',
    url: 'https://www.youtube.com/watch?v=8KaJRw-rfn8',
    meta: '28 min · IBM SkillsBuild',
    dur: '28 min',
    cat: 'IBM SkillsBuild',
    note: 'First video in the IBM SkillsBuild Full Stack series. Good starting point for all interns.',
    visible: true,
    ts: Date.now() - 86400000 * 7
  },
  {
    id: 2,
    type: 'video',
    title: 'HTML & CSS Fundamentals',
    url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc',
    meta: '35 min · IBM SkillsBuild',
    dur: '35 min',
    cat: 'Frontend',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 7
  },
  {
    id: 3,
    type: 'video',
    title: 'JavaScript Essentials',
    url: 'https://www.youtube.com/watch?v=0vL_EhRMFN0',
    meta: '42 min · IBM SkillsBuild',
    dur: '42 min',
    cat: 'Frontend',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 6
  },
  {
    id: 4,
    type: 'video',
    title: 'React Framework Basics',
    url: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
    meta: '38 min · IBM SkillsBuild',
    dur: '38 min',
    cat: 'Frontend',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 6
  },
  {
    id: 5,
    type: 'video',
    title: 'Node.js & Express Backend',
    url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
    meta: '45 min · IBM SkillsBuild',
    dur: '45 min',
    cat: 'Backend',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 5
  },
  {
    id: 6,
    type: 'video',
    title: 'Database Design with MySQL',
    url: 'https://www.youtube.com/watch?v=5RpUmDEsn1k',
    meta: '32 min · IBM SkillsBuild',
    dur: '32 min',
    cat: 'Database',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 5
  },
  {
    id: 7,
    type: 'video',
    title: 'REST API Development',
    url: 'https://www.youtube.com/watch?v=qVTAB8Z2VmA',
    meta: '30 min · IBM SkillsBuild',
    dur: '30 min',
    cat: 'Backend',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 4
  },
  {
    id: 8,
    type: 'video',
    title: 'Deployment & DevOps Basics',
    url: 'https://www.youtube.com/watch?v=h7LDnVsNRVI',
    meta: '26 min · IBM SkillsBuild',
    dur: '26 min',
    cat: 'DevOps',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 4
  },
  // ── Exact docs/links from intern-content.html DOCS array ────────────
  {
    id: 9,
    type: 'link',
    title: 'Full Stack Web Development E-Book',
    url: 'https://cdn.chools.in/DIG_LIB/E-Book/Full-stack-web-development.pdf',
    meta: 'IBM SkillsBuild · PDF E-Book',
    cat: 'IBM SkillsBuild',
    note: 'Companion e-book for the video series. Interns should read alongside the videos.',
    visible: true,
    ts: Date.now() - 86400000 * 3
  },
  {
    id: 10,
    type: 'link',
    title: 'HTML Reference Sheet',
    url: 'https://quickref.me/html.html',
    meta: 'quickref.me · Quick Reference',
    cat: 'Frontend',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 3
  },
  {
    id: 11,
    type: 'link',
    title: 'CSS3 Reference Sheet',
    url: 'https://quickref.me/css3.html',
    meta: 'quickref.me · Quick Reference',
    cat: 'Frontend',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 2
  },
  {
    id: 12,
    type: 'link',
    title: 'JavaScript Cheat Sheet',
    url: 'https://quickref.me/javascript.html',
    meta: 'quickref.me · Quick Reference',
    cat: 'Frontend',
    note: '',
    visible: true,
    ts: Date.now() - 86400000 * 2
  }
];

/**
 * Load content store from localStorage.
 * Seeds all intern content as default on first load.
 */
function loadContentStore() {
  const raw = localStorage.getItem(CONTENT_KEY);
  if (!raw) {
    saveContentStore(DEFAULT_CONTENT);
    return [...DEFAULT_CONTENT];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [...DEFAULT_CONTENT];
  }
}

/**
 * Persist content store to localStorage.
 */
function saveContentStore(store) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(store));
}

/**
 * Returns the next safe ID for a new content item.
 */
function nextContentId(store) {
  return store.length ? Math.max(...store.map(c => c.id)) + 1 : 1;
}

/**
 * Force-reset store to defaults (useful for dev/testing).
 */
function resetContentStore() {
  saveContentStore(DEFAULT_CONTENT);
  return [...DEFAULT_CONTENT];
}