(function () {
  var W = window.Wedding;
  var C = W.config;

  W.fill();
  document.querySelectorAll('[data-cfg-pair]').forEach(function (el) {
    el.textContent = (C.groom || '') + ' & ' + (C.bride || '');
  });
  document.title = (C.groomEn || '') + ' & ' + (C.brideEn || '') + ' — Wedding Invitation';

  var tl = document.getElementById('timeline');
  (C.timeline || []).forEach(function (t) {
    var d = document.createElement('div');
    d.className = 'tl';
    d.innerHTML = '<div class="dot"></div><p class="t"></p><p class="l"></p>';
    d.querySelector('.t').textContent = t.time;
    d.querySelector('.l').textContent = t.label;
    tl.appendChild(d);
  });

  var tr = document.getElementById('transport');
  (C.transport || []).forEach(function (t) {
    var li = document.createElement('li');
    li.innerHTML = '<b></b><span></span>';
    li.querySelector('b').textContent = t.title;
    li.querySelector('span').textContent = t.text;
    tr.appendChild(li);
  });

  if (!C.groomParents && !C.brideParents) document.getElementById('parents').remove();

  var tel = document.getElementById('tel-link');
  if (C.phone) tel.href = W.telUrl();
  else tel.remove();

  document.getElementById('map-link').href = W.mapUrl();

  // ── 捲動淡入 ──
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) {
    io ? io.observe(el) : el.classList.add('in');
  });

  // ── 倒數計時 ──
  var target = new Date(C.datetime).getTime();
  var tiles = {};
  document.querySelectorAll('#countdown b').forEach(function (b) { tiles[b.dataset.u] = b; });
  function setTile(u, v) {
    var s = String(v).padStart(2, '0');
    if (tiles[u].textContent === s) return;
    tiles[u].textContent = s;
    tiles[u].classList.remove('flip');
    void tiles[u].offsetWidth;
    tiles[u].classList.add('flip');
  }
  function tick() {
    var diff = Math.max(0, target - Date.now());
    var sec = Math.floor(diff / 1000);
    setTile('d', Math.floor(sec / 86400));
    setTile('h', Math.floor(sec % 86400 / 3600));
    setTile('m', Math.floor(sec % 3600 / 60));
    setTile('s', sec % 60);
    if (diff === 0) {
      document.getElementById('cd-msg').textContent = '就是今天！謝謝您來參加我們的婚禮';
      return;
    }
    setTimeout(tick, 1000);
  }
  if (!isNaN(target)) tick();

  // ── 桌次查詢（查詢邏輯在 common.js）──
  var form = document.getElementById('seat-form');
  var input = document.getElementById('seat-q');
  var meta = document.getElementById('seat-meta');
  var list = document.getElementById('seat-list');

  function search() {
    var r = W.find(input.value);
    list.innerHTML = '';
    meta.textContent = r.message;

    r.hits.forEach(function (g) {
      var li = document.createElement('li');
      var name = document.createElement('span');
      name.className = 'nm';
      name.textContent = W.displayName(g);
      if (g.count > 1) {
        var badge = document.createElement('em');
        badge.textContent = '共 ' + g.count + ' 位';
        name.appendChild(badge);
      }
      var tb = document.createElement('span');
      tb.className = 'tb';
      if (g.table === '主桌') {
        tb.innerHTML = '<b class="main">主桌</b>';
      } else {
        tb.innerHTML = '<small>桌</small><b></b>';
        tb.querySelector('b').textContent = g.table;
      }
      li.appendChild(name);
      li.appendChild(tb);
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    input.blur(); // 手機上收起鍵盤，讓結果露出來
    search();
  });
  input.addEventListener('input', search);

  // 現場 QR code 可以指向 ...?seat 或 ...#seat，直接跳到查詢區
  if (W.seatMode) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    document.querySelectorAll('#seat .reveal').forEach(function (el) { el.classList.add('in'); });
    // 等圖片、字型載完版面穩定後再跳，並用 instant 蓋過 CSS 的 smooth scroll
    var jump = function () {
      window.scrollTo({ top: document.getElementById('seat').offsetTop, behavior: 'instant' });
    };
    jump();
    window.addEventListener('load', jump);
  }
  if (W.initialQuery) { input.value = W.initialQuery; search(); }
})();
