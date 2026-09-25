// 婚禮基本資料：有更新只要改這個檔案即可。
window.WEDDING = {
  groomEn: "鈺傑",
  brideEn: "雅雯",
  groom: "鈺傑",
  bride: "雅雯",
  // 雙方家長（留空就不顯示）
  groomParents: "",
  brideParents: "",

  // 婚宴開始時間（倒數計時用），ISO 格式、台灣時區
  datetime: "2026-10-11T12:00:00+08:00",
  dateText: "2026.10.11",
  dowText: "星期日 · SUNDAY",

  timeline: [
    { time: "12:00", label: "開席" },
  ],

  venue: "靚點飯店",
  hall: "2 樓",
  address: "新北市新店區北新路三段 219 號",
  phone: "(02) 2918-8889",
  mapQuery: "靚點 新北市新店區北新路三段219號",
  transport: [
    { title: "捷運", text: "大坪林站（松山新店線／環狀線）4 號或 1 號出口，步行約 5 分鐘" },
    { title: "公車", text: "順安街站（步行 6 分鐘）、捷運大坪林站（步行 5 分鐘）、民權路口（步行 5 分鐘）" },
    { title: "開車", text: "進入北新路三段 211 巷，台北矽谷二期大樓，靚點地下停車場" },
  ],

  // 出席調查表單（留空就不顯示按鈕）
  rsvpUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfBD3u9sEvcnuq7imWKac_DFfFSXuMpcyD1UdzFnjplTQlZng/viewform",
};
