# James-Rescue-911 專案初始架構規劃

> 本檔為專案內部使用的規劃筆記，內容同步自 Cursor plan。

## 1. 技術棧總覽

| 層級     | 技術選型                           |
| ------ | ------------------------------ |
| 建構工具   | Vite 5.x                       |
| 前端框架   | React 18 + TypeScript          |
| 樣式     | Tailwind CSS                   |
| 圖表     | Recharts                       |
| 後端     | Supabase (Postgres + Realtime) |
| IoT 介面 | Webhook (即時) + MQTT (預留)       |

---

## 2. 目錄結構 (VHC 架構)

```text
src/
├── views/                    # View 層 - 純 UI 呈現
│   ├── Dashboard/
│   │   ├── DashboardView.tsx
│   │   ├── components/
│   │   │   ├── CounterCards.tsx
│   │   │   ├── ChampionRanking.tsx
│   │   │   ├── TimeDistributionChart.tsx
│   │   │   └── DisturberButtons.tsx
│   │   └── index.ts
│   └── ...
│
├── hooks/                    # Hook 層 - 互動邏輯與即時訂閱
│   ├── useDisturberInteraction.ts   # 點擊加權、發送 payload
│   ├── useRealtimeUpdates.ts       # Supabase Realtime 訂閱
│   └── useTimeAnalysis.ts          # 時段分析資料
│
├── controllers/              # Controller 層 - 業務邏輯
│   ├── disturberController.ts      # B/Todd/CJ 分類與需求說明
│   └── analyticsController.ts      # 排行榜、時段統計邏輯
│
├── services/                 # Service 層 - 外部介面
│   ├── supabase/
│   │   ├── client.ts
│   │   └── disturberService.ts
│   └── iot/
│       ├── webhookService.ts       # Webhook 接收端 (API route)
│       └── mqttBridge.ts           # 預留 MQTT 介面
│
├── types/
│   └── disturber.types.ts
├── lib/
│   └── utils.ts
├── App.tsx
└── main.tsx
```

**VHC 資料流**（摘要）：

- `View`：`DashboardView` → `DisturberButtons` / `CounterCards` / `ChampionRanking` / `TimeDistributionChart`
- `Hook`：`useDisturberInteraction` / `useRealtimeUpdates` / `useTimeAnalysis`
- `Controller`：`disturberController` / `analyticsController`
- `Service`：`supabaseService` / `webhookService`

資料流向：

1. `DisturberButtons` 觸發 `useDisturberInteraction`，呼叫 `disturberController.reportDisturbance`
2. `disturberController` 使用 `supabaseService` 寫入 `disturbance_events`
3. Supabase Realtime 將變更推送給前端，`useRealtimeUpdates` 更新 Counter 與事件列表
4. `useTimeAnalysis` 透過 `analyticsController` 做排行榜與時段分佈分析

---

## 3. 資料結構 (Supabase)

### 3.1 `disturbance_events` 表

| 欄位               | 型別          | 說明                          |
| ---------------- | ----------- | --------------------------- |
| `id`             | uuid        | 主鍵 (auto)                   |
| `timestamp`      | timestamptz | 事件時間                        |
| `disturber_name` | text        | B / Todd / CJ               |
| `request_type`   | text        | Emergency / Normal / Low    |
| `description`    | text        | 需求內容說明 (可選)                 |
| `source`         | text        | web / webhook / mqtt (來源辨識) |
| `level`          | text        | 點擊加權等級                      |

### 3.2 Supabase 設定

- 啟用 **Realtime** 於 `disturbance_events` 表
- Row Level Security (RLS)：依專案需求設定讀寫權限
- 索引：`timestamp`, `disturber_name`, `(disturber_name, timestamp)` 以優化查詢

---

## 4. 功能模組實作要點（摘要）

### 4.1 Dashboard (View)

- 總計數器：今日 / 本週 / 本月總騷擾次數，由 `useRealtimeUpdates` 驅動
- 週/月/季冠軍排行榜：`ChampionRanking` 依 `disturber_name` 聚合，由 `analyticsController` 提供
- 出沒時間分佈圖：Recharts 折線圖，顯示 0–23 點各時段轟炸次數
- 騷擾大軍按鈕：B、Todd、CJ 三個按鈕，點擊即發送 `{ who, level: "Emergency" }`

### 4.2 Interaction (Hook)

- `useDisturberInteraction`：處理按鈕點擊 → 呼叫 `disturberController.reportDisturbance()` → 寫入 Supabase
- `useRealtimeUpdates`：訂閱 `disturbance_events` 的 `INSERT`，即時更新計數與事件清單
- `useTimeAnalysis`：查詢並聚合時段資料，供排行榜與圖表使用

### 4.3 Business Logic (Controller)

- `disturberController`
  - `reportDisturbance(payload)`: 解析 `{ who, level }`，寫入對應欄位
  - `getDisturberDescription(name)`: 回傳 B/Todd/CJ 的需求內容說明
- `analyticsController`
  - `getChampions(period)`: 週/月/季冠軍
  - `getTimeDistribution()`: 依小時彙總時段分佈

### 4.4 Service (IoT Bridge)

- `webhookService`：提供 API 端點 (如 `/api/webhook/disturbance`)，接收 POST `{ who, level }`，寫入 Supabase
- `mqttBridge`：預留 AWS IoT Core MQTT 介面與 topic 設計

---

## 5. 初始化與環境變數

### 初始化步驟（已完成）

1. `npm create vite@latest . -- --template react-ts`
2. 安裝依賴：`tailwindcss`, `@supabase/supabase-js`, `recharts`, `react-is`
3. 設定 Tailwind、Supabase 環境變數 (`.env`)
4. 建立上述目錄與空檔案骨架
5. 在 Supabase 建立 `disturbance_events` 並啟用 Realtime
6. 實作 Service → Controller → Hook → View 串接

### 環境變數

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 6. 已實作檔案對應

請參考 `README.md` 與實際 `src/` 結構；本檔作為高階架構說明與未來擴充的基準文件。

