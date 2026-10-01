// Usage: put this file in your frontend folder (next to intern-dashboard.html), then run:
//   node fix-ids.js
// It changes only two things, in three files, and saves originals in "backup-ids".
const fs = require('fs');

const OLD_URL = 'https://internsync-production-7079.up.railway.app';
const NEW_URL = 'https://internsync-3v10.onrender.com';
const ID_LINE = /const\s+INTERN_ID\s*=\s*3\s*;[^\n]*/;
const NEW_ID  = "const INTERN_ID = Number(localStorage.getItem('internId')) || 3;";

['intern-dashboard.html', 'intern-pvtchat.html', 'intern-discussion.html'].forEach(file => {
  if (!fs.existsSync(file)) { console.log('NOT FOUND (wrong folder?): ' + file); return; }
  const original = fs.readFileSync(file, 'utf8');
  const fixed = original.replace(ID_LINE, NEW_ID).split(OLD_URL).join(NEW_URL);

  if (fixed === original) { console.log('no change needed: ' + file); return; }
  fs.mkdirSync('backup-ids', { recursive: true });
  fs.writeFileSync('backup-ids/' + file, original);
  fs.writeFileSync(file, fixed);
  console.log('FIXED: ' + file);
});