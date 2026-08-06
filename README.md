# 👑 YoakaDash! (yoaka競選之旅)

> **"家人們，幫主包個忙！"**  
> 一款結合 **Muse Dash 雙軌音遊玩法**、**web3 里長拜票競選情境** 與 **A+B AI 智慧抓拍自訂譜面** 的超炫彩跑酷節奏遊戲！

---

## 🌟 遊戲特色 (Game Features)

- 🏃 **Muse Dash 經典雙軌擊打**：
  - **上軌 (空中)** 與 **下軌 (地面)** 雙路徑躍動！雙手合作 `D/F` 與 `J/K` 輕鬆上手！
  - 面向選民派發宣傳面紙隨身包 (`tissue_pack`)，感受流暢過渡殘影與極速擊打爽感！
- 👹 **360px 巨型黑粉強光障礙與 100% 邊緣血紅發光**：
  - 去框黑粉狗姊立牌與獻花鯊魚，周圍爆發濃郁血紅發光暈彩，跳躍閃避臨場感爆表！
- 👗 **3 大競選造型與實質戰力技能加成**：
  - **👑 預設競選背心裝**：拜票最親民，失誤扣支持度 (HP) 傷害減免 33%！
  - **👓 幹練眼鏡秘書裝** (襯衫領帶裝)：理智高冷，每次成功拜票總獲票數 (Score) 額外 +20%！
  - **✨ K-Pop 閃耀偶像裝**：舞台女王，Fever Mode 雙倍票數狂熱能量累積速度達到 200%！
  - 跑道左側 330px 巨型立繪支援 **呼吸律動動畫 (Breathing Pulse)** 與通透無黑底殘影展示！
- 🏆 **專業級結算與 FULL COMBO 金黃認證標章**：
  - 結算面板標示「最高連擊 / 理論極限 Combo 數量」（如 `48 / 50 極限`）。
  - 無失誤完美全接爆發 **🏆 FULL COMBO! 全連擊完美達成** 金黃脈衝勳章！
  - 結算背景採用淡化透亮的音遊賽博跑道毛玻璃，視覺質感絕佳！
- ⚡ **音符出現流速 (SPEED) 6 檔自由調速**：
  - 支援 **`0.50x` (超慢)**、**`0.75x` (悠閒)**、**`1.00x` (標準)**、**`1.25x` (快)**、**`1.50x` (極速)**、**`2.00x` (狂暴)** 6 檔速度切換！
- ⏱️ **暫停解除 5.0 秒緩衝倒數計時**：
  - 點擊 Resume 或重新開始時，先進入 `5... 4... 3... 2... 1...` 黃金倒數，讓您有充足時間放好手指預備！
- 🎵 **A+B 智慧譜面創作者 (Beat Producer)**：
  - 支援上傳任何您喜愛的 MP3 / WAV 音樂檔，AI 自動抓拍生成 Note 譜面，試玩時 100% 播放您上傳的專屬神曲！

---

## 🎮 操控指南 (Controls)

| 操作動作 (Action) | 按鍵配置 (Keybinding) | 說明 (Description) |
| :--- | :--- | :--- |
| **☁️ 上軌擊打 / 空中閃避** | **`D`** 或 **`F`** | 派發面紙給空中大學生選民，或跳躍閃避地面黑粉狗狗立牌 |
| **🏃 下軌擊打 / 地面閃避** | **`J`** 或 **`K`** | 派發面紙給地面上班族選民，或在地面閃避空中獻花鯊魚 |
| **⚡ 雙軌同按 (Dual Strike)** | **`D/F` + `J/K`** 同時按下 | 爆發高亮黃金雷射連線與全螢幕金光閃光！ |
| **⏸️ 暫停 / 選單** | **`Esc`** 鍵或右上按鈕 | 進入暫停選單，解除暫停享有 5.0 秒緩衝倒數計時 |

---

## 🖼️ 素材路徑與自動相容 (Asset Paths & Auto Match)

遊戲引擎支援 `.png` / `.jpg` / `.jpeg` / `.webp` 智慧型全自動容錯載入，您可以隨時替換 `public/` 與 `public/assets/` 下的圖片：

```text
d:\pj\YoakaDash\
├── public\
│   ├── yoaka_main.jpg (或 .png)        # 官方主視覺原畫 / 預設備援圖
│   └── cyber_runway_bg.png (或 .jpg)   # 音遊跑道賽博街景視差背景
└── public\assets\
    ├── yoaka_default.png (或 .jpg)     # 預設競選背心裝照片
    ├── yoaka_office.png (或 .jpg)      # 襯衫領帶眼鏡裝照片
    ├── yoaka_kpop.png (或 .jpg)        # K-Pop 閃耀偶像裝照片
    ├── tissue_pack.png (或 .jpg)       # 宣傳面紙隨身包圖示 (主角頭像)
    ├── voter_office.png (或 .jpg)      # 上班族選民圖案
    ├── voter_student.png (或 .jpg)     # 大學生選民圖案
    ├── hater_dog_board.png (或 .jpg)   # 黑粉狗姊立牌圖案
    └── hater_shark.png (或 .jpg)       # 獻花鯊魚圖案
```

---

## 🛠️ 開發與本地執行 (Development)

### 1. 安裝依賴
```bash
npm install
```

### 2. 本地開發伺服器
```bash
npm run dev
```
開啟瀏覽器存取 `http://localhost:3000/`

### 3. 生產環境編譯
```bash
npm run build
```

---

## 📝 授權與團隊 (License)

Developed with ❤️ for **Yoaka AI Campaign Team**.  
GitHub Repository: [scvjoker/YDash](https://github.com/scvjoker/YDash)
