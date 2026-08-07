---
name: rhythm-runner-game-builder
description: >-
  Build modular, highly-responsive 2D Web Canvas audio rhythm runner games with auto-scaling UI overlays, dual-track collision logic, BeatProducer AI spectrum analyzer, and character skill systems.
---

# 🎮 Web Rhythm Runner Game Builder (網頁雙軌音遊跑酷開發指南)

## 📌 概述 (Overview)
本 Skill 彙整了 Web Canvas 雙軌音效跑酷遊戲 (如 *YoakaDash!*) 的頂級架構經驗，涵蓋**模組化自適應大小 UI 介面系統**、**雙軌 Hit Zone 碰撞引擎**、**BeatProducer 譜面自動抓拍** 與 **角色天賦/狂熱狀態機**。

當需要快速開發同類型網頁音遊、節奏跑酷或互動遊戲時，請遵守本手冊之架構與經驗進行開發。

---

## 🎨 核心模組 1：模組化自適應大小 UI 介面系統 (Modular Auto-scaling UI Framework)

自適應響應式 UI 是遊戲體驗最關鍵的基石，確保無論在 Desktop 高解析螢幕、平板還是手機端，UI 皆不遮擋主跑道且觸控體驗極致絲滑。

### 1.1 UI 層級結構 (Layered UI Stack)
```text
┌────────────────────────────────────────────────────────┐
│ 🔝 Modal Overlays (Tutorial / Pause / Result Overlays) │
├────────────────────────────────────────────────────────┤
│ 📱 Touch Controls Layer (62px Mobile Dual Touch Buttons)│
├────────────────────────────────────────────────────────┤
│ 📊 HUD Overlay Layer (Single-Line Support Meter + Bar) │
├────────────────────────────────────────────────────────┤
│ 🎮 Game Canvas Layer (2D Render Engine & Hit Zone)     │
├────────────────────────────────────────────────────────┤
│ 🖼️ Parallax Background Layer (Cyber Runway & Effects)  │
└────────────────────────────────────────────────────────┘
```

### 1.2 畫布與 UI 動態自適應縮放矩陣 (Responsive Scaling Matrix)
- **基準解析度 (Base Resolution)**：`1280 x 720` (16:9 賽博黃金比例)。
- **動態縮放算式**：
  ```typescript
  const baseWidth = 1280;
  const baseHeight = 720;
  const scaleX = window.innerWidth / baseWidth;
  const scaleY = window.innerHeight / baseHeight;
  const scale = Math.min(scaleX, scaleY); // 保持比例不變形
  ```
- **CSS Clamp 與 Viewport 彈性單位**：
  - 文字標題：`font-size: clamp(1rem, 2.5vw, 2.2rem)`
  - 按鈕與外框：`padding: clamp(8px, 1.5vh, 16px)`

### 1.3 HUD 畫面空間極致利用規範
1. **單行整合頂欄 (Single-Line Integrated Header Panel)**：
   - 嚴禁將血量 (支持度) 與歌曲時間進度條分成兩行佔用天花板。
   - 必須整合於頂端左側 Panel 橫欄中：
     `[ 💓 選民支持度 85%  |  [===== 進度條 =====] 01:23/02:40 ]`
   - 垂直高度控制在 `40px ~ 48px` 內，節省 45px 以上視野。
2. **手機端 `62px` 極致 Touch 觸控按鈕**：
   - 底部 Left / Right 或 Air / Ground 觸控區高度固定為 **`62px`**。
   - 採用半透明毛玻璃 (`backdrop-filter: blur(8px)`) 與兩側弧形圓角，不擋畫面跑道，打擊感靈敏依舊。
3. **動態側邊立繪面板 (Responsive Portrait Panel)**：
   - 主角立繪於 1280px 寬度下固定為 `330px`，隨螢幕自動縮放。
   - 加上 `Breathing Pulse` 呼吸律動動畫，維持極高通透感。

---

## ⚡ 核心模組 2：雙軌 (Air / Ground) 碰撞與 Hater 障礙物避障引擎

### 2.1 軌道嚴格對應與 Hit Zone 判定機制
- **雙軌道定義**：`air` (空中 / 上軌) 與 `ground` (地面 / 下軌)。
- **手動擊打軌道過濾 (`checkHitJudgement`)**：
  ```typescript
  // 必須嚴格比對軌道 note.track === track，防止抓取對側軌道音符造成誤判
  const availableNotes = this.notes.filter(n => !n.hit && n.track === track);
  ```

### 2.2 Hater 障礙物雙向判定邏輯 (Direct Hit & Passive Dodge)
1. **主動誤按撞擊 (Direct Obstacle Hit)**：
   - 當玩家在障礙物所在軌道按下打擊鍵，且距離 Hit Zone ±0.14s 內：
   - 判定為 `❌ HATER HIT!`，扣除支持度 HP (-6)、Combo 歸零、`missCount += 1`，並觸發受傷 SFX 與震動。
   ```typescript
   if (closestNote.type === 'obstacle' || closestNote.entity.startsWith('hater')) {
     this.stats.supportRate = Math.max(0, this.stats.supportRate - 6);
     this.stats.combo = 0;
     this.stats.missCount += 1;
     audioEngine.playSFX('error');
     this.renderEngine.triggerHitEffect(hitX, hitY, '❌ HATER HIT!', 'damage');
     return;
   }
   ```
2. **被動飄過閃避檢測 (Passive Pass-through Dodge)**：
   - 當障礙物飄過 Hit Zone 拍點 (`note.time < currentTime - 0.18`)：
   - **當主角正處於同軌道 (`note.track === this.activeTrack`)**：觸發撞擊扣血與 Combo 歸零。
   - **當主角躲在對側安全軌道 (`note.track !== this.activeTrack`)**：障礙物順暢通過，**100% 無傷過關、不扣血、不記 Miss**！
   ```typescript
   if (note.type === 'obstacle' || note.entity.startsWith('hater')) {
     if (note.track === this.activeTrack) {
       // 站在同軌道 -> 碰撞受傷
       this.triggerHaterHit();
     }
     // 躲在對側軌道 -> 完美閃避！0 扣血 0 Miss 順暢通過！
   }
   ```

---

## 🎵 核心模組 3：BeatProducer 音訊解析與自動譜面生成

### 3.1 Web Audio API 自動抓拍
- 使用 `AudioContext` 與 `AnalyserNode` 讀取音訊解碼資料。
- 分析 Peak 振幅與頻域變化，於重音拍點處自動建立 `air` 或 `ground` 音符。
- 支援 `0.50x` 至 `2.00x` 共 6 檔流速 (Speed) 調速。
- **暫停解除緩衝機制**：點擊 Resume 解除暫停時，先執行 `5.0 秒` 黃金倒數預備。

---

## 👗 核心模組 4：角色技能與 Fever 狂熱狀態機

### 4.1 角色天賦配置樣板
- **🛡️ 防禦背心型**：被擊中受傷 (HP Loss) 減免 33%。
- **👓 理智秘書型**：每次成功擊打獲得總分 (Score) 額外 +20%。
- **✨ K-Pop 偶像型**：Fever Mode 狂熱能量累積速度達到 200%。

### 4.2 Fever Mode 狀態機
- 能量條累積達 100% 自動/手動觸發 **Fever 狂熱狀態**。
- 背景觸發賽博霓虹金黃閃光，得分翻倍，連續 Combo 爽感爆表。

---

## 🏆 核心模組 5：Full Combo 結算與工作日誌規範

### 5.1 結算數據邏輯
- 顯示 **「最高連擊數 / 理論極限 Combo 數」**（例如：`48 / 50 極限`）。
- 當 `Miss === 0` 且達成本首歌曲極限 Combo 時，頒發 **🏆 FULL COMBO! 全連擊完美達成** 金黃脈衝標章。

### 5.2 工作日誌紀錄標準 (`WORK_LOG.md`)
每次對專案進行修復或功能增刪時，**必須**寫入工作日誌：
```markdown
## [YYYY-MM-DD] 功能簡述

### 變更項目 (Component Changes)
- **1. 模组/檔案變更說明 ([Filename.ts](file:///path/to/file))**：
  - 詳細記錄刪除了什麼功能、新增了什麼功能。

---
*「生活感/適度自嘲金句（例：活著很累，但比起 debug，抓出這個 bug 感覺真好哈哈！）」*
```

---

## 🚀 快速啟動範本 (Quick Start Checklist)
1. 建立 Canvas 基準 16:9 容器並綁定 resize 縮放矩陣。
2. 匯入 `HUDOverlay` 橫向一體化 Panel 與 `62px` 手機觸控按鈕。
3. 配置 `GameLoop` 雙軌嚴格比對碰撞演算法。
4. 導入 AudioContext 譜面生成器。
5. 隨時更新 `WORK_LOG.md` 並保持美學視覺一致性！
