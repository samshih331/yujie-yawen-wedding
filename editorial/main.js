(function () {
  var W = window.Wedding;
  var C = W.config;

  W.fill();
  // 星期只留中文（config 的 dowText 是「星期日 · SUNDAY」）
  document.querySelectorAll('[data-cfg="dowText"]').forEach(function (el) {
    el.textContent = String(C.dowText || '').split('·')[0].trim();
  });
  document.title = C.groom + ' & ' + C.bride + ' — The Wedding Issue';

  document.getElementById('times').textContent =
    (C.timeline || []).map(function (t) { return t.time + ' ' + t.label; }).join('　');

  // 地點：地址連到地圖，交通資訊逐列加進規格表
  document.getElementById('addr-link').href = W.mapUrl();
  document.getElementById('map-link').href = W.mapUrl();
  if (C.phone) document.getElementById('tel-link').href = W.telUrl();
  else document.getElementById('tel-row').remove();

  var spec = document.getElementById('place-spec');
  (C.transport || []).forEach(function (t) {
    var row = document.createElement('div');
    row.innerHTML = '<dt></dt><dd></dd>';
    row.querySelector('dt').textContent = t.title;
    row.querySelector('dd').textContent = t.text;
    spec.appendChild(row);
  });

  // 交通圖放大
  var dlg = document.getElementById('map-dialog');
  var openBtn = document.getElementById('map-open');
  if (openBtn && dlg.showModal) {
    openBtn.addEventListener('click', function () { dlg.showModal(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  // ── 倒數：一行大字 + 小字時鐘 ──
  var big = document.getElementById('big-count');
  var clock = document.getElementById('clock');
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var c = W.countdown();
    if (c.phase === 'before') {
      big.innerHTML = '還有<b></b>天';
      big.querySelector('b').textContent = c.calDays;
      clock.textContent = '距離開席 ' + c.d + ' 天 ' + pad(c.h) + ':' + pad(c.m) + ':' + pad(c.s);
    } else if (c.phase === 'today') {
      big.textContent = '就是今天。';
      clock.textContent = c.done ? '' : '開席倒數 ' + pad(c.h) + ':' + pad(c.m) + ':' + pad(c.s);
    } else {
      big.textContent = '謝謝你們的祝福。';
      clock.textContent = '';
      return;
    }
    setTimeout(tick, 1000);
  }
  tick();

  // ── 桌次查詢 ──
  var form = document.getElementById('seat-form');
  var input = document.getElementById('seat-q');
  var meta = document.getElementById('seat-meta');
  var list = document.getElementById('seat-list');

  function render() {
    var r = W.find(input.value);
    meta.textContent = r.message;
    list.innerHTML = '';
    r.hits.forEach(function (g) {
      var li = document.createElement('li');
      li.innerHTML =
        '<span class="who"><span class="nm"></span><span class="cnt"></span></span>' +
        '<span class="dots" aria-hidden="true"></span>' +
        '<span class="tb"></span>';
      li.querySelector('.nm').textContent = W.displayName(g);
      var cnt = li.querySelector('.cnt');
      if (g.count > 1) cnt.textContent = '共 ' + g.count + ' 位';
      else cnt.remove();
      var tb = li.querySelector('.tb');
      if (g.table === '主桌') {
        tb.innerHTML = '<small>TABLE</small><b class="main">主桌</b>';
      } else {
        tb.innerHTML = '<small>TABLE</small><b></b>';
        tb.querySelector('b').textContent = g.table;
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
    return; // 查詢模式不需要淡入動畫
  }

  // ── 淡入 ──
  var targets = document.querySelectorAll('.ch-head, .big-count, .spec, .venue-name, .hero-text');
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  targets.forEach(function (el) { el.classList.add('fx'); io.observe(el); });
})();
