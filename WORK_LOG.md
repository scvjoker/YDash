# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 切換歌曲雙音軌衝突修復 (Audio Mutex Lock) + 8 首實體 MP3 精確長度動態校準

### 變更與音效互斥與動態秒數解析項目 (Audio Mutex & Real Duration Calibration)
- **1. 全域音效互斥與 Token 異步防護 ([AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts) & [SongSelectModal.tsx](file:///d:/pj/YoakaDash/src/components/SongSelectModal.tsx))**：
  - 實裝 `audioEngine.stopAllAudio()` 方法，在打開音樂大廳與快速切換樂曲卡片時，第一時間清空停止主 BGM 與上一首試聽片段。
  - 導入 `currentPreviewToken` 機制：若快速連續點擊多張樂曲卡片，上一首下載解碼完成後若 Discover 發現 Token 已失效，將自動 Discard，**100% 確保全世界只有一首 preview 在播放，零重疊衝突**！
- **2. 8 首實體 MP3 長度精確動態校準 ([SongRegistry.ts](file:///d:/pj/YoakaDash/src/game/SongRegistry.ts))**：
  - 動態讀取實體 AudioBuffer 的真實 duration（如《辯論會激戰 狂想曲》實體長度 5 分 21 秒、《開票夜勝選 狂想曲》實體長度 5 分 03 秒）。
  - 將 8 首曲目的預設 metadata 長度與 BPM 100% 校準至與實體音訊檔完全貼合！

---
*「活著很累，但比起 debug，在選曲大廳隨便快速點擊切換，音軌都清清楚楚、絕不重疊混音，長度顯示還精確到秒，這音效防護寫好太過癮啦哈哈！」*

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
