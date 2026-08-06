# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 暫停介面 (PauseModal) 實裝全螢幕 (Fullscreen) 按鈕 + 畫面切換/跳出 App 自動進入暫停防坑保護

### 變更與手機暫停體驗保護項目 (Pause Modal Fullscreen & Auto-Pause)
- **1. 暫停介面實裝全螢幕按鈕 ([PauseModal.tsx](file:///d:/pj/YoakaDash/src/components/PauseModal.tsx))**：
  - 在遊戲暫停彈窗右上角新增 **` Maximize 全螢幕`** 亮金按鈕。
  - 手機玩家按暫停時可隨時一鍵重新進入全螢幕狀態，隨後點擊「繼續拜票」享受 5 秒緩衝！
- **2. 畫面切換與切離開 App 自動進入暫停 ([App.tsx](file:///d:/pj/YoakaDash/src/App.tsx))**：
  - 監聽 `visibilitychange`（`document.hidden`）與 `window.blur` 事件。
  - 當手機切換至其他 App、收到訊息跳出視窗、或切換瀏覽器分頁時，遊戲會在背景**自動觸發 Pause 暫停**，切回後展示暫停選單並給予 5 秒緩衝倒數，防坑防 Lose！

---
*「活著很累，但比起 debug，跳出訊息或切 App 音遊自動幫我暫停，暫停視窗隨時能按全螢幕，再也不怕手滑掉 Combo 了哈哈！」*

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
