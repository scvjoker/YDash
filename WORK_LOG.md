# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] TutorialOverlay 新手教學 5 大課程左側示意圖片欄位完全還原與美化

### 變更與教學 UI 圖片還原項目 (Tutorial Left Image Restoration)
- **1. 左側圖片欄位完全還原 ([TutorialOverlay.tsx](file:///d:/pj/YoakaDash/src/components/TutorialOverlay.tsx))**：
  - 補回 **Lesson 1** (`/assets/tutorial_lesson1.png` - Note 打擊與手勢示意圖)。
  - 補回 **Lesson 2** (`/assets/tutorial_lesson2.png` - Dual Note 金黃雷射連擊圖)。
  - 補回 **Lesson 3** (`/assets/hater_dog_board.png` & `hater_shark.png` - 6666狗頭與鯊魚圖)。
  - 補回 **Lesson 4** (`/assets/tutorial_lesson4.png` - Fever 雙倍狂歡模式圖)。
  - 補回 **Lesson 5** (3 大 Yoaka 造型實體大圖卡)。
- **2. 實裝 Smart Image Fallback 機制**：
  - 為教學圖片加入 `onError` 載入失敗保護，若素材圖片未上傳，自動切換至面紙包圖示，確保 100% 畫面流暢破圖。

---
*「活著很累，但比起 debug，新手教學左側精美示意圖全部歸位對齊，配上賽博霓虹發光框，這教學介面看著真賞心悅目啊哈哈！」*

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
