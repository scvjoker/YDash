# YoakaDash 開發工作日誌 (WORK_LOG)

## [2026-08-07] 跑道左側角色大圖去黑底硬框 (零黑色殘影) + 動態呼吸律動動畫 (Breathing Pulse Motion)

### 變更與視覺優化項目 (Borderless Hero Side Card & Breathing Animation)
- **1. 拆除矩形黑底與硬邊框 (No Black Box & No Border Artifacts)**：
  - 徹底移除跑道左側角色立繪原本繪製的黑色方塊底色 (`#07091e`) 與硬質 stroke 邊框。
  - 大圖改為極致通透的去框立繪形態，在跟隨上下軌升降跳躍時，完全不會留下任何黑色方塊殘影！
- **2. 角色大立繪動態呼吸律動 (Breathing Pulse Motion)**：
  - 加入動態呼吸波形（`Math.sin(time * 3.5)`）。
  - 大立繪圖片會隨音樂節奏以 `0.96x ~ 1.04x` 的動態比例**微幅微動伸縮與霓虹 Glow 散色律動**，宛如 Live2D 般栩栩如生！

---
*「活著很累，但比起 debug，把黑底硬框拆掉之後完全沒有殘影，而且左邊大圖還會像心跳一樣呼吸律動，畫面真的太生動太高奢了哈哈！」*
