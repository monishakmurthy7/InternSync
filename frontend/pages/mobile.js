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

  // Laptop / desktop: ☰ button that collapses and expands the sidebar.
  // Hidden on phones by mobile.css (phones use the drawer above).
  if (sb && !document.getElementById('sbToggle')) {
    var KEY = 'is-sidebar-collapsed';
    var store = {
      get: function () { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } },
      set: function (v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {} }
    };

    var btn = document.createElement('button');
    btn.className = 'sb-toggle';
    btn.id = 'sbToggle';
    btn.type = 'button';
    btn.textContent = '\u2630';

    var apply = function (collapsed) {
      document.body.classList.toggle('sb-collapsed', collapsed);
      var label = collapsed ? 'Show menu' : 'Hide menu';
      btn.setAttribute('aria-label', label);
      btn.title = label;
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    };

    // Put the button at the start of the shared top bar; otherwise float it.
    var left = document.querySelector('.is-nav-left');
    if (left) {
      left.insertBefore(btn, left.firstChild);
    } else {
      btn.classList.add('floating');
      document.body.appendChild(btn);
    }

    apply(store.get());
    btn.addEventListener('click', function () {
      var next = !document.body.classList.contains('sb-collapsed');
      apply(next);
      store.set(next);
    });
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