# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 防單軌過密誤觸演算法 (Smart Alternate Distribution) + AI 自動辨識譜面階梯量化規則實裝

### 變更與譜面生成與打擊判定優化項目 (Smart Track Alternation & AI Beatmap Rules)
- **1. 防單軌過密誤觸演算法 ([AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts))**：
  - 實裝 **Smart Alternate Distribution** 音符交錯分佈機制：
    - 當同一軌道連續出現超過 2 顆 Note，或距離上一顆音符小於 `0.38` 秒時，系統自動將下一顆 Note 強制分配到對側軌道（Air ↔ Ground）。
    - 形成流暢自然的上下/左右交替打擊感，徹底解決單軌過密導致手忙腳亂與連擊誤觸的痛點！
- **2. 判定時間窗口精準校準 ([GameLoop.ts](file:///d:/pj/YoakaDash/src/game/GameLoop.ts))**：
  - 將 Hit Window 判定範圍從 `0.21s` 精確微調至 **`0.14s`**（Perfect 判定為 `±0.055s`），點擊按壓不再輕易吃下後方預備音符。
- **3. AI 自動辨識譜面 3 大難度階梯規則表 ([AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts))**：
  - **Easy (簡單故事)**：最小間隔 `0.48s` (~2.0音符/秒)，能量門檻 `0.32`，`0%` 雙擊，`5%` 障礙物，強效單軌1:1強制交錯。
  - **Normal (標準競選)**：最小間隔 `0.32s` (~3.1音符/秒)，能量門檻 `0.20`，`10%` 雙擊，`10%` 障礙物，同軌連發上限 2 顆。
  - **Hard (狂想高難)**：最小間隔 `0.20s` (~5.0音符/秒)，能量門檻 `0.12`，`20%` 雙擊，`16%` 障礙物，快節奏動態交錯。

---
*「活著很累，但比起 debug，單軌過密會自動分成上下軌交錯、按壓再也不會誤觸後面音符，這 AI 抓拍演算法簡直太聰明、太順手啦哈哈！」*

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
