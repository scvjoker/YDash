# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 鼓聲音量調柔 (0.22) + 金黃雙擊改為清亮「叮~」音效 + 主畫面首頁 (StartScreen) 雙設定開關顯眼實裝

### 變更與聽覺體驗與設定位置優化項目 (Volume Lowering, Chime Tint & Home Screen Toggles)
- **1. 打擊聲音量微調 ([AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts))**：
  - 將鼓音量大幅調低至 **0.22 (小鼓)** 與 **0.25 (大鼓)**，保持柔和背景節奏感，不掩蓋音樂本體主旋律！
- **2. Dual Strike 金黃雙擊音效大升級 ([AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts))**：
  - 將雙擊音效改為短促、精緻、清亮的**雙頻「叮~」音效 (High Bell Chime E6 1318.5Hz - 2637Hz)**！
- **3. 主畫面首頁 (StartScreen) 雙設定開關放置 ([StartScreen.tsx](file:///d:/pj/YoakaDash/src/components/StartScreen.tsx))**：
  - 在主畫面首頁右上角列，直接顯眼擺放：
    - **`🥁 鼓聲: [ON 啟用] / [OFF 靜音]`**
    - **`📳 震動: [ON 啟用] / [OFF 關閉]`**
  - 玩家免進遊戲即可在首頁隨時點擊切換！同時在遊戲暫停選單（PauseModal）也保持連動備用！

---
*「活著很累，但比起 debug，首頁右上角一眼就能看到鼓聲跟震動開關，雙擊聽到輕快的『叮~』一聲，這聽覺體驗真的舒服啦哈哈！」*

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
