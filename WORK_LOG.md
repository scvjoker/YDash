# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 🎓 新手競選培訓關卡 (Phase Repeat 無縫重複音效 + 手動下一步) + 🎵 多曲選擇選單 Carousel

### 變更與音遊全新系統實裝項目 (Tutorial Stage & Song Selection Carousel)
- **1. 🎓 互動式新手競選培訓關卡 ([TutorialOverlay.tsx](file:///d:/pj/YoakaDash/src/components/TutorialOverlay.tsx))**：
  - 實裝 5 大階段親切引導（1.上軌投紙 ➔ 2.下軌發紙 ➔ 3.雙擊 ➔ 4.閃避黑粉 ➔ 5.FEVER爆發）。
  - 頂端提示牌特地實裝 **`⏭️ 手動下一步 (NEXT STEP)`** 金黃亮色按鈕，玩家既可親自擊中按鍵通關，也可點擊按鈕彈性手動前進！
  - 培訓完成後彈出尊榮親切的 **🎓 競選培訓合格證書** 頒發彈窗！
- **2. 🔁 階段式 Repeat 樂段音效 ([AudioEngine.ts](file:///d:/pj/YoakaDash/src/game/AudioEngine.ts))**：
  - 在 `isTutorial` 模式下，每個教學階段皆有 Web Audio API 即時合成的 4 小節 120 BPM 專屬樂段，在該階段**自動無縫重複循環 (Repeat Loop)**，提供零時間壓力的反覆練習！
- **3. 🎵 規範化歌曲資料標準與多曲選單 Carousel ([SongRegistry.ts](file:///d:/pj/YoakaDash/src/game/SongRegistry.ts) & [SongSelectModal.tsx](file:///d:/pj/YoakaDash/src/components/SongSelectModal.tsx))**：
  - 建立標準化 `SongTrackData` 介面，支援曲目背景與 MP4 影片擴充！
  - 內建 4 首熱血賽博戰歌（含新手培訓、主打歌、155 BPM 高速電音夜、118 BPM 秘書學霸演說曲）。
- **4. 🛡️ 零刪減原則與 100% 相容**：
  - 保持主畫面與既有所有功能按鈕完全原封不動，`npm run build` 通過 0 錯誤編譯。

---
*「活著很累，但比起 debug，看著新手教學可以一段段 repeat 練習，隨時還能點『手動下一步』，這音遊關卡設計得簡直太溫馨太專業了哈哈！」*

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
