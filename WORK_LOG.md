# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 精確 8 首樂曲清單對齊 + 阿狸 DLC 特別企劃《Whats Next?》 + 封面/背景 Smart Fallback 備用機制

### 變更與樂曲庫與資產 Fallback 優化項目 (8 Exact Songs & Smart Fallback)
- **1. 精確 8 首樂曲對齊 ([SongRegistry.ts](file:///d:/pj/YoakaDash/src/game/SongRegistry.ts))**：
  1. 🎵 **《競選出發！》**【起】 (街頭拜票 有歌詞)
  2. ⚡ **《街頭拜票》**【承】 (街頭拜票狂想曲 純音樂)
  3. ⚡ **《街頭拜票狂想曲》**【承】 (街頭拜票狂想曲 高難長曲)
  4. 🎵 **《辯論會激戰》**【轉】 (辯論會激戰 標準版)
  5. ⚡ **《辯論會激戰 (狂想曲)》**【轉】 (辯論會激戰 有歌詞 狂想曲)
  6. 🎵 **《開票夜勝選大爆發》**【合】 (開票夜勝選大爆發 標準版)
  7. ⚡ **《開票夜勝選大爆發 (狂想曲)》**【合】 (開票夜勝選大爆發 有歌詞 狂想曲)
  8. 🔥 **《Whats Next?》**【DLC】 (副標題：`✨ 我推的阿狸 DLC 特典`，演出：`A Li & Jay Lin`，BPM 80)
- **2. 專屬封面與背景 Smart Fallback 備用機制 ([SongSelectModal.tsx](file:///d:/pj/YoakaDash/src/components/SongSelectModal.tsx) & [RenderEngine.ts](file:///d:/pj/YoakaDash/src/game/RenderEngine.ts))**：
  - **封面 Fallback**：若樂曲未設定專屬封面或載入失敗，100% 自動退回使用 `/assets/tissue_pack.png` 當作備用封面！
  - **背景 Fallback**：若樂曲未設定專屬背景或載入失敗，100% 自動退回使用 `/cyber_runway_bg.png` 當作備用賽道背景！

---
*「活著很累，但比起 debug，8 首樂曲清單齊齊整整，封面缺省用衛生紙包，背景缺省用賽博跑道，這備用機制真的太穩太貼心啦哈哈！」*

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
