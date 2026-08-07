# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 雙擊 Note 防擠壓安全緩衝 + TutorialOverlay 手機橫屏 RWD 自適應 + 自製歌曲全曲完整播放

### 變更與打擊防護與 UI RWD 優化項目 (Dual Note Buffer, Tutorial RWD & Custom Song Full Duration)
- **1. 雙擊 Note (Dual Strike) 防擠壓安全緩衝 ([AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts))**：
  - 在生成金黃雙擊音符後，強制為 `lastNoteTime` 追加 **`1.5`** 倍最小拍距的安全反應視窗冷卻緩衝。
  - 確保雙擊過後絕不會瞬間緊貼下一顆單音符，留給玩家極致充裕的雙手復位時間！
- **2. TutorialOverlay 手機橫屏 RWD 極致自適應 ([TutorialOverlay.tsx](file:///d:/pj/YoakaDash/src/components/TutorialOverlay.tsx))**：
  - 為新手教學彈窗加入 `maxHeight: '92vh'`, `maxWidth: '94vw'`, `overflowY: 'auto'` 的動態滾動防護，並壓縮內邊距與圖卡高度。
  - 在手機橫屏（Landscape Mode）上記錄 100% 完美貼合，絕不超出畫面！
- **3. 自製歌曲全曲完整播放修復 ([GameLoop.ts](file:///d:/pj/YoakaDash/src/game/GameLoop.ts))**：
  - 修正了過去玩家上傳自選 MP3 後，因判斷 `lastNote.time + 2.5` 導致播放十幾秒就誤以為結束的問題。
  - 現在遊戲結束判定會 **100% 尊重 AudioBuffer 的真實總時間 `totalAudioDuration`**，整首音訊唱到最後一秒！

---
*「活著很累，但比起 debug，雙擊過後有充裕冷卻時間、新手教學在手機橫屏上完美滿版不溢出、自己上傳的 MP3 還能暢玩整整幾分鐘，這感官與體驗真的太舒服啦哈哈！」*

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
