# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 實裝一鍵全螢幕模式 (Fullscreen Toggle) + 手機橫屏右側選單動態邊界彈性防遮擋適配

### 變更與邊界體驗修復項目 (Fullscreen API & Auto-Fit Bounds)
- **1. 全螢幕模式 (Fullscreen Mode Trigger)**：
  - 在主選單右上角與橫屏提醒視窗上新增 **` Maximize (全螢幕)`** 金黃霓虹按鈕！
  - 點擊可一鍵隱藏手機網址列與系統工具列，讓手機滿版享受 100% 音遊畫質與極致雙手打擊空間！
- **2. 手機橫屏右側選單動態邊界自動適應 (Auto-Fit Scrollable Bounds)**：
  - 更新 [StartScreen.tsx](file:///d:/pj/YoakaDash/src/components/StartScreen.tsx) 右側欄位為彈性自動適應與可滾動容器 (`maxHeight: 96vh`, `overflowY: auto`)。
  - 在高度受限的手機橫屏上，內距 Padding 與按鈕尺寸會自動動態壓縮，徹底解決以往右下角按鈕超出畫面無法點擊的 Bug！

---
*「活著很累，但比起 debug，按一下全螢幕把手機網址列隱藏掉，右下角的按鈕通通看得清清楚楚隨點隨動，這適配真的太貼心了哈哈！」*
