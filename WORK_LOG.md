# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] DLC 特典樂曲 《Whats Next? by A Li & Jay Lin》實裝與選曲點擊入口指引

### 變更與 DLC 樂曲擴充項目 (DLC Track & Selection Guidance)
- **1. 新增 DLC 特典樂曲 ([SongRegistry.ts](file:///d:/pj/YoakaDash/src/game/SongRegistry.ts) & [SongSelectModal.tsx](file:///d:/pj/YoakaDash/src/components/SongSelectModal.tsx))**：
  - 新增 DLC 限定神曲 **《Whats Next?》**（創作者：`A Li & Jay Lin`，BPM 168），帶有【DLC】專屬紫金霓虹徽章，收錄在「競選音樂大廳」！
- **2. 樂曲切換點擊入口指引**：
  - **點擊位置**：在主畫面（StartScreen）右側中段的「當前競選戰歌」卡片右上角，點擊藍色霓虹按鈕 **`🎵 切換樂曲`** 即可彈出音樂大廳選歌！

---
*「活著很累，但比起 debug，點擊『🎵 切換樂曲』就能打開音樂大廳，還能玩到 A Li & Jay Lin 的神曲《Whats Next?》，這音遊爽度真的太高了哈哈！」*

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
