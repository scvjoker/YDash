# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] SongRegistry 樂曲庫修訂紀錄 + 實體檔案資產上傳盤點備忘 (Audio & Cover Assets)

### 變更與 SongRegistry 修訂紀錄 (SongRegistry Revision)
- **1. 音訊路徑精準對齊 ([SongRegistry.ts](file:///d:/pj/YoakaDash/src/game/SongRegistry.ts))**：
  - 將 7 首競選歌曲音訊對齊至 `public/assets/audio/` 下實體檔案：
    - `campaign_start.mp3`
    - `street_rhapsody_inst.mp3`
    - `street_rhapsody.mp3`
    - `debate_battle.mp3`
    - `debate_rhapsody_vocal.mp3`
    - `victory_night.mp3`
    - `victory_rhapsody_vocal.mp3`
  - 將 DLC 限定曲《Whats Next? by A Li & Jay Lin》封面連接至現有實體檔 `public/assets/cover_whats_next.png`！

### 📁 實體檔案資產盤點狀態 (Asset Upload Status Checklist)

#### ✅ 已上傳並正常連結的 7 首音訊與 1 張 DLC 封面：
- `public/assets/audio/campaign_start.mp3` (競選出發！【起】)
- `public/assets/audio/street_rhapsody_inst.mp3` (街頭拜票【承】)
- `public/assets/audio/street_rhapsody.mp3` (街頭拜票狂想曲【承】)
- `public/assets/audio/debate_battle.mp3` (辯論會激戰【轉】)
- `public/assets/audio/debate_rhapsody_vocal.mp3` (辯論會激戰 狂想曲【轉】)
- `public/assets/audio/victory_night.mp3` (開票夜勝選大爆發【合】)
- `public/assets/audio/victory_rhapsody_vocal.mp3` (開票夜勝選大爆發 狂想曲【合】)
- `public/assets/cover_whats_next.png` (Whats Next? 專屬 DLC 封面)

#### ⚠️ 尚未上傳的 1 首 DLC 音訊檔 (需放入 `public/assets/audio/`)：
- 🌸 **`whats_next_ali_jaylin.mp3`**（第 8 首：`Whats Next? by A Li & Jay Lin` 音訊檔，目前自動使用 Fallback 音源）

---
*「活著很累，但比起 debug，7 首音樂檔跟 Whats Next 封面全部歸位對齊，清楚記下還差哪一首 MP3，這盤點真的太有條理啦哈哈！」*

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
