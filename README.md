# 婚禮網站

純靜態網站（HTML/CSS/JS，無需建置），可直接部署到 GitHub Pages。

| 檔案 | 用途 |
|---|---|
| `config.js` | 新人姓名、日期、會館、交通等基本資料 |
| `seating.js` | 賓客桌次名單 |
| `assets/photo.jpg` | 封面婚紗照 |
| `assets/map.jpg` | 交通圖（可省略） |
| `素材/` | 原始素材暫放區 |

## 本機預覽

    python3 -m http.server 8000
    # 開 http://localhost:8000

## 現場 QR code

QR code 指向 `https://<網址>/?seat`，掃描後會直接跳到「查詢桌次」區塊。
