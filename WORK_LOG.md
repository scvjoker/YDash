# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 主畫面右側選單手機極致緊湊適配 + 造型選單 (CostumeModal) 滿版彈性縮放與防遮擋修復

### 變更與手機介面選擇修復項目 (Mobile Menu & Costume Modal Optimization)
- **1. 主畫面右側選單極致手機緊湊適配 ([StartScreen.tsx](file:///d:/pj/YoakaDash/src/components/StartScreen.tsx))**：
  - 將主標題字體大小改為響應式 `calc(1.8rem + 1.8vh)`，並全面縮小按鈕 Padding 與邊隙 Gap。
  - 在任何高度受限的手機橫屏上，**不需要滾動頁面即可 100% 完整呈現並輕鬆點擊所有按鈕與難度/流速選單**！
- **2. 造型選單 Mobile 滿版彈性動態適配 ([CostumeModal.tsx](file:///d:/pj/YoakaDash/src/components/CostumeModal.tsx))**：
  - 為造型選單視窗加入 `maxHeight: 94vh` 與 `overflowY: auto` 彈性容器。
  - 3 大造型卡片的圖片高度在手機橫屏下動態壓縮至 `135px`，擺放極致清爽，解決以往卡片與關閉鈕超出手機螢幕上下邊界無法選取的 Bug！

---
*「活著很累，但比起 debug，主選單跟造型換裝館在手機上打開全部看得一清二楚，隨手一點就能換造型開始拜票，這體驗真的太完美了哈哈！」*
