# James Rescue 911

騷擾事件監控儀表板 - AIoT 整合專案

## 連結

- **GitHub Repo**: https://github.com/yun1988/james-rescue-911
- **Vercel 部署**: https://james-rescue-911.vercel.app

> 提醒：如果之後你在 Vercel 上改了 Project 名稱或 Domain，記得同步更新這兩條連結。

## 技術棧

- **前端**: Vite + React 18 + TypeScript + Tailwind CSS + Recharts
- **後端**: Supabase (Postgres + Realtime)
- **架構**: View-Hook-Controller (VHC) 三層架構

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定 Supabase

1. 在 [Supabase](https://supabase.com) 建立專案
2. 複製 `.env.example` 為 `.env`，填入：

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. 在 Supabase SQL Editor 執行 `supabase/migrations/001_create_disturbance_events.sql`
4. 在 Database > Replication 中將 `disturbance_events` 加入 Realtime 訂閱

### 3. 啟動開發伺服器

```bash
npm run dev
```

### 4. GitHub / Vercel 自動部署

- 此專案已連接 GitHub Repo `yun1988/james-rescue-911`，並由 Vercel 自動部署。
- **推到 `main`：**
  - 每次 `git push origin main`，Vercel 會自動重新 build + 部署 Production，網址不變。
- **其他分支（例如 `feature/*`）：**
  - `git push origin feature/xxx` 後，Vercel 會自動建立 Preview Deployment，會有一個預覽網址，只影響該分支。
- 不需要在 Vercel 手動重建，只要透過 Git commit + push 就會觸發。

## 專案結構 (VHC)

```
src/
├── views/          # View 層 - UI 呈現
├── hooks/          # Hook 層 - 互動與即時訂閱
├── controllers/    # Controller 層 - 業務邏輯
├── services/       # Service 層 - Supabase、IoT 介面
├── types/          # 型別定義
└── lib/            # 工具函式
```

## 核心功能

- **騷擾大軍按鈕**: B、Todd、CJ 快速點擊，每擊發送 `{ who, level: "Emergency" }`
- **總計數器**: 今日 / 本週 / 本月騷擾次數（即時更新）
- **冠軍排行榜**: 週 / 月 / 季冠軍
- **時段分佈圖**: 分析哪個時段最常被騷擾

## IoT 整合

### Webhook

部署 API 端點接收 POST `{ who, level }`，參考 `src/services/iot/webhookService.ts`。

### MQTT (預留)

未來可透過 AWS IoT Core 訂閱 `james-rescue-911/disturbance/+`，參考 `src/services/iot/mqttBridge.ts`。
