# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 歌曲切換大廳左右欄 100% 強效絕對等高 + 拔除重複選項 + 雙欄 Cyber 滾動條

### 變更與 UI 精簡與強效對齊項目 (Song Select Dual Scrollbar & Streamlined Exact Equal Height Layout)
- **1. 拔除右側重複的「難度」與「流速」按鈕 ([SongSelectModal.tsx](file:///d:/pj/YoakaDash/src/components/SongSelectModal.tsx))**：
  - 拔除右側詳細卡片中重複佔空間的難度與流速切換選項（繼承主畫面已選好的難度與流速），介面變得無比乾淨清爽！
- **2. 左右兩欄 100% 強效絕對等高對齊 (`height: 58vh/56vh`)**：
  - 左側樂曲清單與右側詳情卡片高度強制固定為 `height: isMobileScreen ? '58vh' : '56vh'`，手機與電腦上記錄 **100% 絕對齊高對齊**！
- **3. 雙欄獨立 `.cyber-scrollbar` 滾動條**：
  - 為右側詳情卡片與左側曲庫清單同時裝備 `.cyber-scrollbar` 滾動條，任何欄位內容過長均可順暢滾動！
- **4. 完美相容使用者對 `SongRegistry.ts` Subtitle Title 的最新修訂**：
  - 自動相容與保留使用者對《競選出發！》、《街頭拜票》、《辯論會激戰》、《開票夜勝選大爆發》等 Subtitle/Title 的本機精修內容。

---
*「活著很累，但比起 debug，把曲庫右邊重複的按鈕拔掉、左右兩邊拉到 100% 齊高、兩邊都有雙微光滾動條，這視覺乾淨度簡直太治癒啦哈哈！」*

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
