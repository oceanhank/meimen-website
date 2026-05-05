## Why

新竹美門社區關懷協會現有網站採用 WordPress + Elementor 部落格版型（MH Magazine Lite），外觀老舊、無品牌識別感，難以吸引新訪客。改版目標是打造具備品牌溫度的機構型網站，參考台灣恩典與賦能發展協會（GESFPC）的設計語言，並採 Headless 架構讓編輯人員繼續使用熟悉的 WordPress 後台。

## What Changes

- 前端完整重建為 Astro SSG 專案，不再依賴 WordPress 主題
- 後端保留 WordPress，透過 REST API 供稿，實現 Headless 架構
- 設計系統導入 GESFPC 暖棕橘色系（主色 `#604c44`、accent `#e88766`）及有機曲線動畫風格
- 首頁重建為機構型版面：Hero 輪播、關於我們互動區塊、服務課程輪播、快捷入口卡片
- 導覽結構對應 GESFPC：關於我們、服務訊息、文章專欄、線上課程、蒙恩出版/資源、聯絡我們
- 加入 Slick.js 輪播 + GSAP 滾動觸發動畫
- 支援 WordPress Webhook 自動觸發 Astro 靜態重建

## Non-Goals

- 不建立 WordPress 客製主題（沿用預設主題，前台由 Astro 接管）
- 不遷移舊網站內容至新系統（內容編輯由管理員自行處理）
- 不建立會員系統、購物車或線上奉獻收款功能
- 不處理多語系（僅中文繁體）
- 不複製 GESFPC 的確切版面，僅借鑑設計風格與互動模式

## Capabilities

### New Capabilities

- `design-system`: 色彩 token、字型系統、有機形狀動畫（Blob）、Slick 輪播、GSAP 滾動觸發動畫等全站共用設計基礎
- `headless-wp-integration`: Astro 透過 WordPress REST API 取得文章、頁面、自訂 Post Type 資料；支援 Webhook 觸發靜態重建
- `home-page`: 首頁完整版面，含 Hero 輪播（文字 + 圖片雙軌）、關於我們互動區塊、服務課程輪播、快捷入口卡片區
- `navigation-shell`: 固定 Header（Logo + 水平選單 + 社群連結 + 漢堡選單）、側滑手機選單、三欄式 Footer
- `content-pages`: 關於我們、服務訊息列表、文章專欄列表與詳細頁、聯絡我們等內頁

### Modified Capabilities

（無——全為全新建立）

## Impact

- Affected specs: design-system, headless-wp-integration, home-page, navigation-shell, content-pages
- Affected code:
  - New: `src/pages/index.astro`
  - New: `src/pages/about/index.astro`
  - New: `src/pages/news/index.astro`
  - New: `src/pages/article/index.astro`
  - New: `src/pages/article/[slug].astro`
  - New: `src/pages/contact/index.astro`
  - New: `src/layouts/BaseLayout.astro`
  - New: `src/components/Header.astro`
  - New: `src/components/Footer.astro`
  - New: `src/components/SlideMenu.astro`
  - New: `src/components/HeroBanner.astro`
  - New: `src/components/AboutSection.astro`
  - New: `src/components/CourseSection.astro`
  - New: `src/components/LinkSection.astro`
  - New: `src/lib/wp-api.ts`
  - New: `src/styles/global.css`
  - New: `src/styles/tokens.css`
  - New: `astro.config.mjs`
  - New: `package.json`
  - New: `public/`
