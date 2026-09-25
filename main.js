(function () {
  var W = window.Wedding;
  var C = W.config;

  W.fill();
  // 星期只留中文（config 的 dowText 是「星期日 · SUNDAY」）
  document.querySelectorAll('[data-cfg="dowText"]').forEach(function (el) {
    el.textContent = String(C.dowText || '').split('·')[0].trim();
  });
  document.title = C.groom + ' ♥ ' + C.bride + ' — 我們要結婚了';

  // ── 小月曆：婚禮當月，當天畫圈 ──
  // 用台灣時區的年月日，避免在其他時區看到錯的日期
  var ymd = new Date(C.datetime).toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' }).split('-').map(Number);
  var year = ymd[0], month = ymd[1], day = ymd[2];
  document.getElementById('cal-title').textContent = year + ' 年 ' + month + ' 月';
  var grid = document.getElementById('cal-grid');
  '日一二三四五六'.split('').forEach(function (w) {
    var s = document.createElement('span');
    s.className = 'wd';
    s.textContent = w;
    grid.appendChild(s);
  });
  var first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  var days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  for (var i = 0; i < first; i++) grid.appendChild(document.createElement('span'));
  for (var d = 1; d <= days; d++) {
    var s = document.createElement('span');
    s.textContent = d;
    if ((first + d - 1) % 7 === 0) s.className = 'sun';
    if (d === day) {
      s.className = 'day-on';
      // 手繪感的圈
      s.insertAdjacentHTML('beforeend',
        '<svg viewBox="0 0 40 36" aria-hidden="true"><path d="M22 3C10 1 2 9 3 19c1 10 12 15 22 13 9-2 13-9 12-16C36 8 29 2 18 4"/></svg>');
    }
    grid.appendChild(s);
  }

  document.getElementById('plan').innerHTML = '';
  (C.timeline || []).forEach(function (t) {
    var li = document.createElement('li');
    li.innerHTML = '<b></b><span></span>';
    li.querySelector('b').textContent = t.time;
    li.querySelector('span').textContent = t.label;
    document.getElementById('plan').appendChild(li);
  });

  // ── 翻頁倒數（依婚期動態計算）──
  var label = document.getElementById('cd-label');
  var row = document.getElementById('countdown');
  var tiles = {};
  row.querySelectorAll('b').forEach(function (b) { tiles[b.dataset.u] = b; });
  function setTile(u, v) {
    var s = String(v).padStart(2, '0');
    if (tiles[u].textContent === s) return;
    tiles[u].textContent = s;
    tiles[u].classList.remove('flip');
    void tiles[u].offsetWidth; // 重新觸發翻頁動畫
    tiles[u].classList.add('flip');
  }
  function tick() {
    var c = W.countdown();
    if (c.phase === 'after' || c.done) {
      label.textContent = c.phase === 'after' ? '謝謝你來參加我們的婚禮！' : '婚宴開始囉！';
      row.classList.add('hide');
      return;
    }
    label.textContent = c.phase === 'today' ? '就是今天！開席倒數' : '倒數';
    setTile('d', c.d);
    setTile('h', c.h);
    setTile('m', c.m);
    setTile('s', c.s);
    setTimeout(tick, 1000);
  }
  tick();

  // ── 地點 ──
  document.getElementById('addr-link').href = W.mapUrl();
  document.getElementById('map-link').href = W.mapUrl();
  if (C.phone) document.getElementById('tel-link').href = W.telUrl();
  else document.getElementById('tel-row').remove();
  var notes = document.getElementById('notes');
  (C.transport || []).forEach(function (t) {
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    dt.textContent = t.title;
    dd.textContent = t.text;
    notes.appendChild(dt);
    notes.appendChild(dd);
  });

  var dlg = document.getElementById('map-dialog');
  var openBtn = document.getElementById('map-open');
  if (openBtn && dlg.showModal) {
    openBtn.addEventListener('click', function () { dlg.showModal(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  // ── 查詢座位 ──
  var form = document.getElementById('seat-form');
  var input = document.getElementById('seat-q');
  var meta = document.getElementById('seat-meta');
  var card = document.getElementById('card');
  var list = document.getElementById('seat-list');

  function render() {
    var r = W.find(input.value);
    meta.textContent = r.message;
    list.innerHTML = '';
    card.hidden = !r.hits.length;
    r.hits.forEach(function (g) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="nm"></span><span class="seal"></span>';
      var nm = li.querySelector('.nm');
      nm.textContent = W.displayName(g);
      if (g.count > 1) {
        var cnt = document.createElement('span');
        cnt.className = 'cnt';
        cnt.textContent = '共 ' + g.count + ' 位';
        nm.appendChild(cnt);
      }
      var seal = li.querySelector('.seal');
      if (g.table === '主桌') {
        seal.innerHTML = '<b class="main">主桌</b>';
      } else {
        seal.innerHTML = '<small>第</small><b></b><small>桌</small>';
        seal.querySelector('b').textContent = g.table;
      }
      list.appendChild(li);
    });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    input.blur();
    render();
  });
  input.addEventListener('input', render);
  if (W.initialQuery) { input.value = W.initialQuery; render(); }

  // ── 現場查詢模式 ──
  document.getElementById('full-link').href = W.fullUrl;
  if (W.seatMode) {
    document.body.classList.add('seat-mode');
    document.querySelector('.hearts').remove(); // 查詢模式停用動畫
    return;
  }

  // ── 淡入 ──
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.stop:not(.hero) > *:not(.node)').forEach(function (el) {
    el.classList.add('fx');
    io.observe(el);
  });
})();
