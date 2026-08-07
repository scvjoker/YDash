# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 新手教學 5 大課程實體素材盤點與路徑規範備忘

### 🎨 圖文新手教學素材清單 (Tutorial Asset Checklist)
- **Lesson 1 (Note 打擊)**：
  - `public/assets/yoaka_default.png` (競選 Yoaka 跑者圖)
  - `public/assets/tissue_pack.png` (拜票面紙包)
  - `public/assets/voter_office.png` / `voter_student.png` (選民圖片)
- **Lesson 2 (Dual Note 金黃雙擊)**：
  - `public/assets/tutorial_lesson2.png` (雙擊教學示意卡片)
- **Lesson 3 (Hater 障礙物)**：
  - `public/assets/hater_dog_board.png` (6666 黑粉狗頭立牌)
  - `public/assets/hater_shark.png` (霸道鯊魚)
- **Lesson 4 (Fevertime 雙倍狂歡)**：
  - `public/assets/tutorial_lesson4.png` (Fever 熱血爆發示意卡片)
- **Lesson 5 (3 大造型戰力)**：
  - `public/assets/yoaka_default.png` (競選 Yoaka - 減傷)
  - `public/assets/yoaka_office.png` (學霸 Yoaka - +20%得分)
  - `public/assets/yoaka_kpop.png` (偶像 Yoaka - 快速Fever)

---
*「活著很累，但比起 debug，把 5 大圖文教學素材清單條理分明整整齊齊寫出來，要補圖替換一目了然，真的太舒爽啦哈哈！」*

## [2026-08-07] 音遊 HUD 畫面空間極致優化：進度條與選民支持度 (HP) 整合同一層 + 62px 雙極致觸控按鈕

### 變更與音遊 HUD 畫面空間優化項目 (Single-Line Header Panel & Compact HUD)
- **1. 「歌曲時間進度條」與「選民支持度 (HP)」整合至同一層 ([HUDOverlay.tsx](file:///d:/pj/YoakaDash/src/components/HUDOverlay.tsx))**：
  - 徹底取消頂部獨立一行的進度條區塊，改為直接內嵌整合至頂端左側 Panel 橫欄中：
    - **`[ 選民支持度 85%  |  [===== 進度條 =====] 01:23/02:40 ]`**
  - 整整節省了 45px 的頂部天花板高度，再也不擋畫面！
- **2. 底部雙 Touch 按鈕高度精簡至 `62px`**：
  - 手機觸控按鈕高度由原先的 85px ~ 115px 精簡至極致合適的 `62px`，手感靈敏依舊，畫面中央音遊跑道的垂直視野直接擴大一倍！

---
*「活著很累，但比起 debug，BeatProducer 在手機上點開也能完美縮放，上傳 MP3 直接試玩自製神曲，這體驗真的太絲滑流暢了哈哈！」*
