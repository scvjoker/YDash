# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] iOS Safari 避開工具列與無邊框沉浸全螢幕 4 大最佳實踐方案全數落地實裝

### 變更與 iOS Safari 專屬最佳化項目 (iOS Safari Toolbar & Fullscreen Optimization)
- **1. 方案一 (100svh + Safe Area + viewport-fit=cover)**：
  - 更新 [index.html](file:///d:/pj/YoakaDash/index.html) Meta: `<meta name="viewport" content="... viewport-fit=cover">`。
  - 外層容器升級為 **`100svh` (Small Viewport Height)**，永遠以「網址列展開時」最小可見區域為基準，徹底鎖定視覺，防止 Safari 工具列收合與展開時產生抖動！
  - 實裝 CSS 避開瀏海與動態島 Safe Area: `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)`。
- **2. 方案二 (引導用戶「加入主畫面」PWA Standalone)**：
  - 植入 iOS Standalone Meta Tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`)。
  - 新增 [IOSHomePrompt.tsx](file:///d:/pj/YoakaDash/src/components/IOSHomePrompt.tsx)！當 iOS 使用者點擊全螢幕按鈕時，彈出精美的 2 步驟 PWA「加入主畫面」沉浸解鎖指南彈窗。
- **3. 方案三 (1px 觸控自動滾動折疊網址列黑科技)**：
  - 在 [App.tsx](file:///d:/pj/YoakaDash/src/App.tsx) 實裝首次 `touchstart` 事件觸發 `window.scrollTo(0, 1)`，引導 iOS Safari 自動將頂部與底部網址列向下折疊！
- **4. 方案四 (UI Safe Zone 安全區策略)**：
  - 核心 Canvas 與 HUD 按鈕雙重內縮 Safe Zone，確保持續避開動態島與 Safari 網址列！

---
*「活著很累，但比起 debug，把 100svh、Safe Area、iOS 1px 觸控隱藏網址列跟『加入主畫面』PWA 指南一次搞定，這 iOS 體驗品質簡直封神啦哈哈！」*

## [2026-08-07] 使用者更新 TutorialOverlay 新手教學敘述 + 自動 Git Push 完成

### 變更項目 (User Tutorial Description Update)
- **1. 新手教學文案修訂 ([TutorialOverlay.tsx](file:///d:/pj/YoakaDash/src/components/TutorialOverlay.tsx))**：
  - 同步使用者修訂之新手教學細部文案與說明文字。
- **2. 自動 Git Commit & Push**：
  - 變更已 100% 成功推送到 GitHub 遠端倉庫 `scvjoker/YDash` (Commit `db5f032`)！

---
*「活著很累，但比起 debug，看著您修訂的新手教學文案順利 Push 到 GitHub，專案推進的感覺真美好啊哈哈！」*

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
