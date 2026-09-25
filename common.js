// 三個設計版本共用的邏輯：填入 config、桌次查詢、倒數、現場查詢模式。
// 各版本只負責呈現。需在 config.js、seating.js 之後載入。
(function () {
  var C = window.WEDDING || {};
  var SEATING = window.SEATING || [];

  // ── 把 config.js 的內容填進有 data-cfg 屬性的元素 ──
  function fill(root) {
    (root || document).querySelectorAll('[data-cfg]').forEach(function (el) {
      var v = C[el.getAttribute('data-cfg')];
      if (v != null) el.textContent = v;
    });
  }

  function mapUrl() {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.mapQuery || C.venue || '');
  }

  function telUrl() {
    return C.phone ? 'tel:' + C.phone.replace(/[^\d+]/g, '') : '';
  }

  // ── 桌次查詢 ──
  // 正規化：去空白、全形轉半形、台/臺視為同字，避免賓客打字習慣不同查不到
  function norm(s) {
    return String(s)
      .replace(/[！-～]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
      .replace(/\s+/g, '')
      .replace(/臺/g, '台')
      .toLowerCase();
  }
  var index = SEATING.map(function (g) {
    return { g: g, keys: String(g.name).split(/\s+/).map(norm) };
  });
  function tableOrder(t) { return t === '主桌' ? -1 : Number(t) || 999; }
  function displayName(g) { return String(g.name).split(/\s+/)[0]; }

  // 回傳 { state, hits, guests, message }
  // state: 'blank' 沒輸入 / 'pending' 名單尚未提供 / 'none' 查無 / 'ok'
  function find(raw) {
    var q = norm(raw || '');
    if (!q) return { state: 'blank', hits: [], guests: 0, message: '' };
    if (!SEATING.length) {
      return { state: 'pending', hits: [], guests: 0, message: '座位表整理中，婚禮前會開放查詢，敬請期待' };
    }
    var hits = index.filter(function (r) {
      return r.keys.some(function (k) { return k.indexOf(q) !== -1; });
    }).map(function (r) { return r.g; });

    // 完全相符的排最前面，其餘依桌次排序
    hits.sort(function (a, b) {
      var ea = norm(displayName(a)) === q ? 0 : 1;
      var eb = norm(displayName(b)) === q ? 0 : 1;
      return ea - eb || tableOrder(a.table) - tableOrder(b.table);
    });

    if (!hits.length) {
      return { state: 'none', hits: [], guests: 0, message: '查無「' + String(raw).trim() + '」，請確認姓名或洽詢現場招待人員' };
    }
    var guests = hits.reduce(function (n, g) { return n + (g.count || 1); }, 0);
    return { state: 'ok', hits: hits, guests: guests, message: '找到 ' + hits.length + ' 筆結果（共 ' + guests + ' 位賓客）' };
  }

  // ── 倒數 ──
  // phase: 'before' 婚禮前 / 'today' 婚禮當天 / 'after' 婚禮後
  function countdown() {
    var target = new Date(C.datetime);
    var now = new Date();
    var diff = Math.max(0, target - now);
    var sec = Math.floor(diff / 1000);
    // 以台灣日期判斷是否同一天
    var ymd = function (d) { return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' }); };
    var phase = ymd(now) === ymd(target) ? 'today' : (now < target ? 'before' : 'after');
    // 「還有 N 天」用日曆天計算，比較符合一般人的直覺
    var dayMs = 86400000;
    var calDays = Math.round((Date.parse(ymd(target)) - Date.parse(ymd(now))) / dayMs);
    return {
      phase: phase,
      calDays: Math.max(0, calDays),
      d: Math.floor(sec / 86400),
      h: Math.floor(sec % 86400 / 3600),
      m: Math.floor(sec % 3600 / 60),
      s: sec % 60,
      done: diff === 0,
    };
  }

  // ── 現場查詢模式（QR code 指向 ?seat）──
  var params = new URLSearchParams(location.search);
  var seatMode = params.has('seat') || location.hash === '#seat';
  // 「看完整邀請」用：同一路徑、不帶任何參數
  var fullUrl = location.pathname;

  window.Wedding = {
    config: C,
    fill: fill,
    mapUrl: mapUrl,
    telUrl: telUrl,
    find: find,
    displayName: displayName,
    countdown: countdown,
    seatMode: seatMode,
    initialQuery: params.get('q') || '',
    fullUrl: fullUrl,
  };
})();
