// Usage: put patch-pages.js, mobile.css and mobile.js in your frontend folder
// (next to the html files), then run:  node patch-pages.js
// Originals are copied to a "backup-mobile" folder first. Safe to re-run.
const fs = require('fs');

const files = fs.readdirSync('.').filter(f =>
  /^(intern|mentor)-.*\.html$/.test(f)
);

// Some sidebars point to file names that don't exist. Point them to the real pages.
const LINK_FIXES = {
  'intern-assigned.html':       'intern-taskassigned.html',
  'intern-leaverequest.html':   'intern-leave.html',
  'intern-chat.html':           'intern-pvtchat.html',
  'intern-discussionroom.html': 'intern-discussion.html'
};

if (!fs.existsSync('mobile.css') || !fs.existsSync('mobile.js')) {
  console.log('mobile.css / mobile.js not found in this folder. Copy them here first.');
  process.exit(1);
}
fs.mkdirSync('backup-mobile', { recursive: true });

files.forEach(file => {
  let s = fs.readFileSync(file, 'utf8');
  const original = s;

  // 1) fix wrong sidebar links
  Object.keys(LINK_FIXES).forEach(bad => {
    s = s.split('href="' + bad + '"').join('href="' + LINK_FIXES[bad] + '"');
  });

  // 2) viewport tag if missing
  if (!/name=["']viewport["']/.test(s)) {
    s = s.replace('<meta charset="UTF-8">',
      '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }

  // 3) link the shared files
  if (!s.includes('mobile.css')) {
    s = s.replace('</head>', '<link rel="stylesheet" href="mobile.css">\n</head>');
  }
  if (!s.includes('mobile.js')) {
    s = s.replace(/<\/body>\s*(<\/body>)?/, '<script src="mobile.js" defer></script>\n</body>');
  }

  if (s !== original) {
    fs.writeFileSync('backup-mobile/' + file, original);
    fs.writeFileSync(file, s);
    console.log('PATCHED: ' + file);
  } else {
    console.log('no change: ' + file);
  }
});