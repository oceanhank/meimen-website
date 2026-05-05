## Context

新竹美門社區關懷協會現有網站以 WordPress 6.2 + Elementor + MH Magazine Lite 主題建構，域名為 `bg.nghcc.org.tw/wp2`。內容由志工透過 WordPress 後台維護。網站目前缺乏品牌識別、版型老舊、行動裝置體驗差。

目標設計參考對象：台灣恩典與賦能發展協會（GESFPC，`gesfpc.org.tw`）——暖棕橘色系（`#604c44` / `#e88766`）、有機曲線 Blob 動畫、Slick.js 輪播、GSAP 滾動觸發、自訂 SVG 裝飾元素。

前端採 Astro 4.x SSG，部署至靜態主機（如 GitHub Pages、Netlify、Cloudflare Pages）。後端保留現有 WordPress，僅開放 REST API 存取，前端完全接管所有頁面渲染。

## Goals / Non-Goals

**Goals:**

- 以 Astro 建構靜態前端，透過 WordPress REST API 取得所有內容
- 首頁呈現機構型版面（Hero 輪播、About 互動、Course 輪播、Link Cards）
- 設計系統採 GESFPC 暖棕橘色調，Slick.js 輪播 + GSAP 動畫
- 支援 WordPress Webhook 觸發 Astro 重建（內容更新後自動上線）
- 手機版響應式，含側滑漢堡選單

**Non-Goals:**

- 不建立 WordPress 客製主題
- 不做會員登入、購物車、線上奉獻
- 不支援多語系
- 不做伺服器端動態搜尋（靜態頁面為主）

## Decisions

### 前端框架選用 Astro

選擇 Astro 4.x 而非 Next.js / Nuxt：
- 美門網站以靜態內容為主（文章、課程、活動），SSG 無 JS 執行時負擔最輕
- Astro 的 `.astro` 格式與 HTML 相近，Vibe Coding（AI 產碼）可讀性最高
- 可直接在 `<script>` 標籤嵌入 jQuery + Slick.js + GSAP，無需框架橋接
- 與 Headless WordPress 的搭配方案（`headless-wp-astro`）在本專案已有技術積累
- 替代方案 Next.js：ISR 功能更強，但 React hydration 複雜度對此規模網站過高

### WordPress 保持原狀，僅作內容倉庫

WordPress 不安裝新主題，前台路由由 Astro 完全接管：
- REST API endpoint：`/wp-json/wp/v2/posts`、`/wp-json/wp/v2/pages`、自訂 CPT
- 使用 ACF（Advanced Custom Fields）或 Custom Post Types 管理課程、服務項目資料
- 替代方案 Headless CMS（Contentful / Sanity）：需遷移全部現有資料，風險過高

### 動畫技術：Slick.js + GSAP + CSS Blob

與 GESFPC 保持一致的技術選擇：
- Slick.js 處理輪播（Hero 文字、圖片、課程卡片）
- GSAP + ScrollTrigger 處理滾動觸發進場動畫
- CSS `border-radius` Blob 動畫處理有機形狀裝飾（不需 canvas）
- jQuery 作為 Slick 的依賴（保持與 GESFPC 一致，降低 Vibe Coding 的學習難度）

### 設計 Token 從 GESFPC CSS 直接提取

色彩系統直接沿用 GESFPC 分析結果，寫入 `src/styles/tokens.css`：
- 主色：`--color-main: #604c44`
- Accent：`--color-accent: #e88766`
- 輔色黃：`--color-deco-yellow: #FFCC00`
- 輔色粉：`--color-deco-pink: #FFD9CC`
- 字體：`"Noto Sans TC"` 主字體，`"Outfit"` 英文數字

### 靜態重建由 GitHub Actions + Webhook 驅動

WordPress 安裝 WP Webhooks 外掛，於發布文章時觸發 GitHub Actions workflow，執行 `astro build` 並部署至靜態主機。

## Risks / Trade-offs

- **WordPress CORS 設定** → 需在 `.htaccess` 或外掛加入 `Access-Control-Allow-Origin` header，允許 Astro dev server 存取
- **自訂 Post Type 未建立** → 若課程、服務使用一般 `post` 類型，分類邏輯需靠 category/tag，結構彈性較低。緩解：改版初期先用一般文章分類，後期再升級 CPT
- **Slick.js + Astro 整合** → Slick 需在 DOM ready 後初始化，Astro Island 機制可能造成時序問題。緩解：將 Slick 初始化放在 `document.addEventListener('DOMContentLoaded', ...)` 或 `<script>` 標籤加 `is:inline` 屬性
- **GSAP ScrollTrigger 在 SSG** → GSAP 需 browser API，SSR 模式下不可執行。Astro 預設 SSG（不執行 client-side），只要把 GSAP 放在 `<script>` 標籤即可，無需特別處理
- **靜態重建延遲** → 編輯發文後需等 GitHub Actions 完成（約 1-3 分鐘）才上線。此為 Headless SSG 固有限制，對非營利組織發文頻率可接受

## Migration Plan

1. 建立新 Astro 專案，設定 WordPress API 連線（環境變數 `WP_API_BASE_URL`）
2. 本機開發完成首頁 + 主要內頁
3. WordPress 現有內容無需遷移，Astro 直接讀取
4. 設定靜態主機（Netlify 或 GitHub Pages），完成 DNS 切換
5. 舊 WordPress 前台保留但不對外，後台繼續供編輯使用
6. Rollback：DNS 切回舊 WordPress 主機即可

## Open Questions

- 美門的導覽最終結構（是否完全照搬 GESFPC 或需調整為美門的服務項目名稱）？
- 課程/服務資料是否使用 ACF + 自訂 CPT，或先用一般文章分類？
- 靜態部署目標主機（Netlify / GitHub Pages / Cloudflare Pages）？
