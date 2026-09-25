# 婚禮網站

純靜態網站（HTML/CSS/JS，無需建置），可直接部署到 GitHub Pages。

| 檔案 | 用途 |
|---|---|
| `config.js` | 新人姓名、日期、會館、交通等基本資料，以及配色 `theme` |
| `seating.js` | 賓客桌次名單 |
| `assets/photo.jpg` | 封面婚紗照 |
| `assets/map.jpg` | 交通圖（可省略） |
| `common.js` | 三個設計共用：填入 config、桌次查詢、倒數、現場查詢模式 |
| `editorial/` | 設計 B：攝影雜誌 |
| `journal/` | 設計 C：森林散步手帳 |
| `designs.html` | 三種設計並排比較頁 |
| `素材/` | 原始素材暫放區 |

## 本機預覽

    python3 -m http.server 8000
    # 開 http://localhost:8000

## 現場 QR code

QR code 指向 `https://<網址>/?seat`，掃描後會直接跳到「查詢桌次」區塊。

## 配色主題

`config.js` 的 `theme` 設定預設配色：`forest`（森林綠）、`latte`（奶茶暖棕）、`night`（墨綠金）。
網址加 `?theme=latte` 可以臨時預覽其他配色；（僅適用設計 A）
