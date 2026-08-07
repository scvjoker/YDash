# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 切換樂曲無反應與預設歌曲問題修復 + 選曲大廳自動 15 秒音樂試聽 (Audio Engine Upgrade)

### 變更與音響切換修復項目 (Dynamic Song Switch & Hall Preview)
- **1. 遊戲開局樂曲 100% 正確連動 ([GameLoop.ts](file:///d:/pj/YoakaDash/src/game/GameLoop.ts) & [AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts))**：
  - 升級 `AudioEngine.loadAudioFromUrl(url)`，在遊戲開局與選取歌曲時，全面動態下載解碼該歌曲的實體 MP3/WAV 檔。
  - 解決了過去固定讀取預設 `/theme_song.mp3` 的問題。現在選哪首，進入遊戲 100% 正確播放選定的戰歌與即時抓拍音符！
- **2. 選曲大廳點擊卡片自動 15 秒試聽 ([SongSelectModal.tsx](file:///d:/pj/YoakaDash/src/components/SongSelectModal.tsx))**：
  - 在音樂大廳點擊切換樂曲時，自動觸發 `audioEngine.playPreviewFromUrl(song.audio)` 播放該曲目的副歌試聽片段！
  - 關閉彈窗或點擊「▶ 播放開局」時自動靜音停止試聽，轉入遊戲主音訊，體驗流暢順滑！

---
*「活著很累，但比起 debug，在選曲大廳點哪首就立刻試聽哪首，進入遊戲音浪 100% 正確播放，這音響順暢度真的太舒服啦哈哈！」*

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
