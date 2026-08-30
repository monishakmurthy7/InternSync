/**
 * debug-token.js
 * Paste this entire script into your browser DevTools Console
 * while on any InternSync page to diagnose the token issue.
 * 
 * Run: copy-paste → Enter
 */
(function() {
  console.group('%c🔍 InternSync Token Diagnostic', 'color:#d9a441;font-size:14px;font-weight:bold');

  // 1. Scan localStorage
  console.group('localStorage keys');
  if (localStorage.length === 0) {
    console.warn('  (empty)');
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const v = localStorage.getItem(k);
      const isToken = v && v.length > 20 && v.includes('.');
      console.log('%c  [' + k + '] = ' + v.slice(0, 40) + (v.length > 40 ? '…' : '') +
        (isToken ? '  ✅ looks like JWT' : ''), isToken ? 'color:#2dd4bf' : '');
    }
  }
  console.groupEnd();

  // 2. Scan sessionStorage
  console.group('sessionStorage keys');
  if (sessionStorage.length === 0) {
    console.warn('  (empty)');
  } else {
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      const v = sessionStorage.getItem(k);
      console.log('  [' + k + '] = ' + v.slice(0, 40));
    }
  }
  console.groupEnd();

  // 3. URL params
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');
  console.log('URL ?token param:', urlToken ? urlToken.slice(0,30)+'… ✅' : 'not present');

  // 4. Test the API directly with whatever token we found
  const allKeys = ['token','authToken','jwt','userToken','access_token','intern_token'];
  let foundToken = urlToken;
  if (!foundToken) {
    for (const k of allKeys) {
      const t = localStorage.getItem(k) || sessionStorage.getItem(k);
      if (t && t.length > 10) { foundToken = t; console.log('Using token from key "'+k+'"'); break; }
    }
  }

  if (foundToken) {
    console.log('%c✅ Testing API with token…', 'color:#2dd4bf');
    fetch('http://localhost:3000/api/submissions', {
      headers: { Authorization: 'Bearer ' + foundToken }
    })
    .then(r => r.json().then(d => ({ status: r.status, body: d })))
    .then(({ status, body }) => {
      if (status === 200) {
        console.log('%c✅ API OK! Found ' + body.length + ' submission(s)', 'color:#2dd4bf', body);
      } else {
        console.error('❌ API returned ' + status + ':', body);
        if (status === 401) console.error('→ Token is invalid or expired. Try logging out and back in.');
      }
    })
    .catch(e => console.error('❌ Network error — is server running on :3000?', e.message));
  } else {
    console.error('%c❌ NO TOKEN FOUND anywhere. You are not logged in.', 'color:#ff6b6b');
    console.log('→ Go to your login page, log in, then come back and run this again.');
  }

  console.groupEnd();
})();