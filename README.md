# 鈺傑 & 雅雯 婚禮網站

純靜態網站（HTML/CSS/JS，無需建置），部署在 GitHub Pages：
https://samshih331.github.io/yujie-yawen-wedding/

設計：森林散步手帳（手寫字、小月曆、翻頁倒數、腳印小路、哈利）。

| 檔案 | 用途 |
|---|---|
| `config.js` | 新人姓名、日期、會館、交通等基本資料 |
| `seating.js` | 賓客桌次名單 |
| `common.js` | 填入 config、桌次查詢、倒數、現場查詢模式 |
| `index.html` / `style.css` / `main.js` | 頁面 |
| `assets/` | photo.jpg 婚紗照、map.jpg 交通圖、harry.jpg 哈利 |
| `素材/` | 原始素材暫放區（不上傳） |

## 本機預覽

    python3 -m http.server 8000
    # 開 http://localhost:8000

## 現場 QR code

QR code 指向 `https://samshih331.github.io/yujie-yawen-wedding/?seat`，
掃描後只顯示「查詢座位」，上方有「看完整邀請」可回到完整頁面。
