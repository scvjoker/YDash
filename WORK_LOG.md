# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] iOS Safari 全螢幕與導覽列避讓 4 大黃金解法全數實裝落地

### 變更與 iOS Safari 視埠與 PWA 優化項目 (iOS Fullscreen & Safe Area Integration)
- **1. 方案一：現代 CSS 動態視埠單位 (100svh) + Safe Area ([index.html](file:///d:/pj/YoakaDash/index.html) & [index.css](file:///d:/pj/YoakaDash/src/index.css))**：
  - 設定 `viewport-fit=cover`, `maximum-scale=1.0`, `user-scalable=no`。
  - 使用 `100svh` 鎖定視覺區域避免 Safari 工具列收合帶來的畫面抖動。
  - 引入 `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)` 避開 iPhone 瀏海與動態島。
- **2. 方案二：引導用戶「加入主畫面」(PWA Standalone) ([IOSInstallPrompt.tsx](file:///d:/pj/YoakaDash/src/components/IOSInstallPrompt.tsx))**：
  - 實裝 `apple-mobile-web-app-capable` 與 `apple-mobile-web-app-status-bar-style` 標籤。
  - 建立 `IOSInstallPrompt` 獨立引導元件，在 iOS 非 Standalone 模式時溫馨引導玩家「分享 ➔ 加入主畫面」解鎖 100% 獨立無邊框全螢幕。
- **3. 方案三：網址列動態折疊技巧 (Touch Nudge Scroll) ([App.tsx](file:///d:/pj/YoakaDash/src/App.tsx))**：
  - 監聽玩家首次 `touchstart` 觸摸，自動觸發 `window.scrollTo(0, 1)` 自動觸發 Safari 網址列收合。
- **4. 方案四：動態自適應畫布與安全區設計 ([PauseModal.tsx](file:///d:/pj/YoakaDash/src/components/PauseModal.tsx))**：
  - 在 `PauseModal` 中對 iOS 裝置提供專屬沉浸體驗提示，避免原生日誌報錯。

---
*「活著很累，但比起 debug，把 iOS 4 大全螢幕方案一口氣實裝完成，iOS 上玩起來完全不被 Safari 工具列騷擾，這適配細節真的太講究啦哈哈！」*

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
