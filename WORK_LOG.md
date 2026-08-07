# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 🎓 新手競選培訓精美圖文引導 Modal + 🎵 4 首戰歌 MP3 格式與目錄結構說明

### 變更與圖文教學 Modal 及音訊目錄說明 (Graphic Tutorial Modal & Audio Specs)
- **1. 🎓 新手競選培訓改版為精美圖文簡報 Modal ([TutorialOverlay.tsx](file:///d:/pj/YoakaDash/src/components/TutorialOverlay.tsx))**：
  - 將新手教學獨立為 5 大課堂互動圖文簡報（1.雙軌拜票與傳單發送 ➔ 2.雙擊音符與票數倍增 ➔ 3.閃避黑粉與支持度 HP ➔ 4.FEVER 熱血雙倍爆發 ➔ 5.3 大競選戰袍技能指南）。
  - 提供左右分頁切換、進度點點與「我懂了！開始競選拜票」按鈕，讀圖讀文直觀清晰！
- **2. 📁 4 首內建音樂檔案格式 (.mp3) 與 public/audio/ 放置位置 ([SongRegistry.ts](file:///d:/pj/YoakaDash/src/game/SongRegistry.ts))**：
  - 音樂檔案格式統一為：**`.mp3`**（或 `.wav`），放置於專案根目錄下的 **`public/audio/`**：
    1. `public/audio/tutorial_theme.mp3` ➔ 🎓 新手競選培訓主題曲
    2. `public/audio/election_journey.mp3` ➔ 🎵 yoaka競選之旅 (主打歌)
    3. `public/audio/cyber_night.mp3` ➔ ⚡ 賽博小島電音夜
    4. `public/audio/secretary_speech.mp3` ➔ 👓 秘書學霸演說曲

---
*「活著很累，但比起 debug，圖文新手教學一目了然，音樂檔直接放 public/audio/*.mp3，這設計整理得太清晰舒服了哈哈！」*

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
