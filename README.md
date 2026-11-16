# 公平交易法日報 (Fair Trade Law Daily)

> 專注於競爭法最新實務、執法動態與市場秩序觀察的現代數位報刊平台。

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)

---

## 專案簡介

「公平交易法日報」是一個輕量、免編譯且具備現代數位報刊質感的靜態新聞彙整網站。專門追蹤與記錄公平交易法相關處分、結合申報、聯合行為調查、不實廣告裁罰以及國際競爭法動態。

### 核心特色
- **現代數位報刊設計**：採用米白底色（`#F9F8F6`）、深海軍藍（`#1B365D`）與磚紅強調色（`#B85042`），搭配襯線標題（Noto Serif TC）與清晰無襯線內文（Noto Sans TC）。
- **資料與版面嚴格分離**：所有新聞報導皆以 JSON 格式儲存於 `data/` 資料夾，日常發布新聞**完全不需修改任何 HTML/CSS/JS 程式碼**。
- **純原生技術（Zero Dependencies）**：基於純 HTML5、CSS3 與 Vanilla JavaScript 開發，零相依套件、秒級加載。
- **即時分類篩選與期數切換**：支援依議題分類（不實廣告、結合申報、聯合行為、國際動態等）即時過濾，並可隨時自下拉選單回溯歷史期數。
- **自適應響應式設計（RWD）**：桌機呈現經典報刊雙欄排版（左欄頭條焦點、右欄重點快訊），行動裝置自動切換為單欄直向閱讀。

---

## 專案目錄結構

```text
fair-trade-daily/
├── index.html          # 網站主首頁（報頭、分類導覽、頭條與快訊區、頁尾）
├── style.css           # 現代數位報刊風樣式表（含雙欄/單欄響應式設計）
├── app.js              # 核心前端邏輯（JSON 讀取、分類篩選、期數切換）
├── GEMINI.md           # 專案 AI 協作與修改守則
├── README.md           # 專案說明文件
├── LICENSE             # MIT 開源授權條款
├── .gitignore          # Git 忽略檔案設定
└── data/               # 日報資料庫（所有文章內容均在此管理）
    ├── issues.json     # 歷史期數索引清單
    ├── 2026-11-16.json # 創刊號（第 1 期）報導資料
    └── 2026-11-17.json # 第 2 期報導資料
```

---

## 本機預覽與測試

由於現代瀏覽器的安全性限制（CORS 政策），直接按兩下開啟 `index.html`（`file:///` 協定）將無法讀取 `data/` 中的 JSON 檔案。建議使用以下任一種本機伺服器方式開啟：

### 方法一：使用 VS Code Live Server（最推薦）
1. 使用 VS Code 開啟本專案資料夾。
2. 在 VS Code 的延伸模組（Extensions）中搜尋並安裝 **Live Server**。
3. 在 `index.html` 檔案上按滑鼠右鍵，選擇 **「Open with Live Server」** 即可。

### 方法二：使用 Python 內建伺服器
若電腦已安裝 Python，可於專案根目錄開啟終端機執行：
```bash
python -m http.server 8000
```
接著於瀏覽器網址列輸入 `http://localhost:8000` 即可預覽。

---

## 如何發布新一期日報？

日常發布新內容時，**只需在 `data/` 資料夾操作兩個步驟**：

### 步驟 1：新增當天的新聞資料檔案
在 `data/` 資料夾中新增一個以日期為檔名的 JSON 檔（例如 `data/2026-11-18.json`），格式如下：

```json
{
  "date": "2026-11-18",
  "headline": {
    "date": "2026-11-18",
    "title": "頭條新聞標題",
    "category": "不實廣告",
    "lawTag": "公平交易法第 21 條",
    "summary": "頭條報導詳細摘要說明...",
    "sourceUrl": "https://www.ftc.gov.tw"
  },
  "news": [
    {
      "date": "2026-11-18",
      "title": "快訊新聞標題 1",
      "category": "結合申報",
      "lawTag": "公平交易法第 11 條",
      "summary": "快訊報導摘要說明...",
      "sourceUrl": "https://www.ftc.gov.tw"
    }
  ]
}
```

> **欄位說明**：
> - `date`：發布日期（格式：`YYYY-MM-DD`）
> - `title`：新聞標題
> - `category`：分類標籤（如：不實廣告、結合申報、聯合行為、限制競爭、國際動態）
> - `lawTag`：法規依據（如：公平交易法第 21 條、國際競爭法）
> - `summary`：新聞核心摘要
> - `sourceUrl`：原文來源連結

### 步驟 2：在 `data/issues.json` 登記新期數
打開 `data/issues.json`，將新期數加在**最上方**（這樣網頁開啟時會自動優先載入最新一期）：

```json
[
  {
    "date": "2026-11-18",
    "title": "2026 年 11 月 18 日（第 3 期）"
  },
  {
    "date": "2026-11-17",
    "title": "2026 年 11 月 17 日（第 2 期）"
  },
  {
    "date": "2026-11-16",
    "title": "2026 年 11 月 16 日（創刊號）"
  }
]
```

儲存後重新整理網頁，即可看到最新一期的日報！

---
