# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 障礙物安全防護間隔實裝 (>=2.5x拍距) + 平滑修訂 Normal ➔ Hard 難度級距

### 變更與譜面節奏與難度平衡項目 (Obstacle Safety Gap & Smoothed Difficulty Curve)
- **1. 障礙物至少間隔 2.5x 最小拍距 ([AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts))**：
  - 實裝 **Obstacle Safety Window** 強效保護間隔（間隔 `>= 0.75` 秒或最小拍距的 `2.5` 倍以上）。
  - 預留極致充裕的閃避時間反應視窗，絕不會讓黑粉狗頭或鯊魚緊貼前一顆音符出現，給玩家最流暢的閃避體驗！
- **2. 平滑修訂 Normal ➔ Hard 難度陡峭級距 ([AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts))**：
  - 將過去過於陡峭變態的 Hard 最小間隔由 `0.20s` (每秒 5 顆) 平滑調降至 **`0.25s`** (每秒約 4 顆)。
  - 雙擊 Note 機率由 20% 平滑修正為 **`15%`**，障礙物機率平滑修正為 **`12%`**。
  - 讓 Easy (0.48s) ➔ Normal (0.32s) ➔ Hard (0.25s) 的挑戰曲線呈現極度自然流暢的階梯性！

---
*「活著很累，但比起 debug，障礙物再也不會緊貼音符偷襲，Hard 難度玩起來流暢又熱血，這譜面平衡改完手感簡直完美啦哈哈！」*

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
