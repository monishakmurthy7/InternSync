// Usage: put this file in the same folder as auth.html, main.html and
// intern-dashboard.html (your frontend folder), then run:  node patch.js
// It makes a .bak backup of each file first. Safe to run only once per file.
const fs = require('fs');

function patch(file, fn) {
  if (!fs.existsSync(file)) { console.log('SKIP (not found): ' + file); return; }
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('/*MOBILE-FIX*/')) { console.log('SKIP (already patched): ' + file); return; }
  fs.writeFileSync(file + '.bak', s);
  s = fn(s);
  fs.writeFileSync(file, s);
  console.log('PATCHED: ' + file);
}

function addCss(s, css) {
  return s.replace('</style>', '/*MOBILE-FIX*/\n' + css + '\n</style>');
}

/* ---------- auth.html ---------- */
patch('auth.html', s => {
  s = s.replace('<meta charset="UTF-8">',
    '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  return addCss(s, `
body{ height:auto; min-height:100vh; overflow-x:hidden; overflow-y:auto; padding:20px; }
.card{ width:100%; max-width:390px; }
.toast{ white-space:normal; max-width:90vw; text-align:center; }
@media (max-width:480px){
  body{ align-items:flex-start; padding:90px 16px 30px; }
  .card{ padding:24px 20px; }
  .otp-row{ gap:6px; }
  .otp-box{ width:40px !important; height:50px; }
}`);
});

/* ---------- main.html ---------- */
patch('main.html', s => addCss(s, `
@media (max-width:768px){
  .hero-text{ padding:0 20px 64px; }
  .hero-title{ font-size:8.5vw; }
  .hero-title .line2{ font-size:7vw; padding-left:6vw; }
  .corner-label{ left:20px; }
  .corner-label-r{ right:20px; }
  .logo-fixed{ left:20px; }
  .scroll-ind{ right:20px; }
  .btn-gs{ padding:16px 28px; }
}
@media (hover:none){
  body{ cursor:auto; }
  #cur,#ring,#glow{ display:none; }
}`));

/* ---------- intern-dashboard.html ---------- */
patch('intern-dashboard.html', s => {
  s = addCss(s, `
.menu-fab, .sidebar-overlay{ display:none; }
@media (max-width:768px){
  .layout{ z-index:auto; }
  main{ padding:20px 16px 90px; }
  .greeting{ font-size:22px; }
  .sub{ font-size:13px; }
  .grid{ grid-template-columns:1fr; }
  .col-span-2, .col-span-3{ grid-column:span 1; }
  .fb-scroll{ grid-template-columns:1fr; }
  .attendance-horiz{ flex-direction:column; align-items:flex-start; }
  .pill-tooltip{ white-space:normal; min-width:0; width:100%; }
  .sidebar{
    position:fixed; top:0; left:0; bottom:0; height:100%;
    width:260px; z-index:10000;
    background:rgba(10,13,6,.97);
    transform:translateX(-100%);
    transition:transform .3s ease;
    padding-top:70px;
  }
  .sidebar.open{ transform:translateX(0); }
  .sidebar-overlay.show{
    display:block; position:fixed; inset:0;
    background:rgba(0,0,0,.55); z-index:9999;
  }
  .menu-fab{
    display:flex; align-items:center; justify-content:center;
    position:fixed; left:16px; bottom:20px;
    width:52px; height:52px; border-radius:50%;
    background:var(--accent); color:#1a1d0f;
    border:none; font-size:22px; cursor:pointer;
    z-index:10001; box-shadow:0 8px 24px rgba(0,0,0,.5);
  }
}`);

  s = s.replace('<div class="glow" id="glow"></div>',
    '<div class="glow" id="glow"></div>\n' +
    '<button class="menu-fab" id="menuFab" aria-label="Open menu">\u2630</button>\n' +
    '<div class="sidebar-overlay" id="sbOverlay"></div>');

  const js = `
// ── MOBILE SIDEBAR ──
(function(){
  const sb = document.querySelector('.sidebar');
  const ov = document.getElementById('sbOverlay');
  const fab = document.getElementById('menuFab');
  function toggleMenu(open){
    sb.classList.toggle('open', open);
    ov.classList.toggle('show', open);
    fab.textContent = open ? '\\u2715' : '\\u2630';
  }
  fab.addEventListener('click', () => toggleMenu(!sb.classList.contains('open')));
  ov.addEventListener('click', () => toggleMenu(false));
})();
`;
  const i = s.lastIndexOf('</script>');
  return s.slice(0, i) + js + s.slice(i);
});