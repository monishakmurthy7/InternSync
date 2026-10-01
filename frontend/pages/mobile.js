// mobile.js — shared mobile helpers for InternSync pages.
(function () {
  // Chat pages get a different button position (see mobile.css)
  if (document.getElementById('chatInput') || document.getElementById('msgInput')) {
    document.body.classList.add('has-chat');
  }

  // Sidebar drawer. Skipped if the page already has its own menu button.
  var sb = document.querySelector('.sidebar');
  if (sb && !document.getElementById('menuFab')) {
    var ov = document.createElement('div');
    ov.className = 'sidebar-overlay';
    ov.id = 'sbOverlay';

    var fab = document.createElement('button');
    fab.className = 'menu-fab';
    fab.id = 'menuFab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Open menu');
    fab.textContent = '\u2630';

    document.body.appendChild(ov);
    document.body.appendChild(fab);

    var toggle = function (open) {
      sb.classList.toggle('open', open);
      ov.classList.toggle('show', open);
      fab.textContent = open ? '\u2715' : '\u2630';
    };
    fab.addEventListener('click', function () { toggle(!sb.classList.contains('open')); });
    ov.addEventListener('click', function () { toggle(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 768) toggle(false); });
  }

  // Certificate: shrink the fixed 860px page to fit the screen
  var page = document.querySelector('.page');
  if (page && document.querySelector('.inner-border')) {
    var fit = function () {
      var w = window.innerWidth;
      page.style.zoom = w < 900 ? (w - 24) / 860 : 1;
    };
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('beforeprint', function () { page.style.zoom = 1; });
    window.addEventListener('afterprint', fit);
  }
})();