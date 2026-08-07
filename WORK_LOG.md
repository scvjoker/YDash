# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 🎓 圖文教學導入實體黑粉/道具/造型圖片 + 🎵 4 首競選一路升遷主題戰歌重塑

### 變更與主題歌單重塑項目 (Embedded Tutorial Images & Election Progression Tracks)
- **1. 圖文教學 Modal 導入實體圖片資源 ([TutorialOverlay.tsx](file:///d:/pj/YoakaDash/src/components/TutorialOverlay.tsx))**：
  - 在新手引導簡報中精準嵌入遊戲實體圖片：
    - `面紙傳單` (`/assets/tissue_pack.png`)
    - `狗頭舉牌黑粉` (`/assets/hater_dog_board.png`)
    - `賽博巨型鯊魚` (`/assets/hater_shark.png`)
    - `競選/學霸/偶像 Yoaka` 3 大造型實體頭像 (`/assets/yoaka_default.png`...)
- **2. 重新規劃 4 首「競選一路升遷」主題熱血戰歌 ([SongRegistry.ts](file:///d:/pj/YoakaDash/src/game/SongRegistry.ts))**：
  - 打造從里長起步一路角逐至頂峰幫主的階梯故事歌單：
    1. 🎵 `1. 巷弄拜票：里長起手式` (120 BPM - `public/audio/track1_chief.mp3`)
    2. 🎵 `2. 區長爭霸：賽博政見會` (138 BPM - `public/audio/track2_district.mp3`)
    3. 🎵 `3. 市長大選：小島電音夜` (152 BPM - `public/audio/track3_mayor.mp3`)
    4. 👑 `4. 幫主登場：最高政壇巔峰` (168 BPM - `public/audio/track4_master.mp3`)

---
*「活著很累，但比起 debug，圖文教學有狗頭黑粉跟面紙實圖看，歌單變成一路從里長升到幫主，這故事代入感真的太過癮了哈哈！」*

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
