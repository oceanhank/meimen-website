## 1. 專案初始化與設計系統

- [x] 1.1 依照設計決策「前端框架選用 Astro」，以 `npm create astro@latest` 初始化 Astro 4.x 專案，選擇 Minimal 模板，設定 TypeScript strict 模式，建立 `astro.config.mjs`
- [x] 1.2 依照設計決策「動畫技術：Slick.js + GSAP + CSS Blob」安裝前端依賴：`jquery`、`slick-carousel`、`gsap`；並在 `package.json` 加入 `build` 與 `preview` 指令
- [x] 1.3 依照設計決策「設計 Token 從 GESFPC CSS 直接提取」建立 `src/styles/tokens.css`，實作「Color token system」：定義 `--color-main: #604c44`、`--color-accent: #e88766`、`--color-deco-yellow`、`--color-deco-pink`、`--color-text-body`、`--color-text-dark`、`--color-bg` 等 CSS 自訂屬性
- [x] 1.4 建立 `src/styles/global.css`，實作「Typography system」：引入 Google Fonts（Noto Sans TC + Outfit），設定 `body` 預設字體、行高、字距
- [x] 1.5 在 `src/styles/global.css` 實作「Organic blob shape animations」：新增 `@keyframes lavaBlob`、`lavaBlobSoft`、`branchSway`、`slideUpAnimation` 四個動畫定義
- [x] 1.6 在 `src/styles/global.css` 定義「Responsive breakpoints」媒體查詢變數，並寫入文件說明各斷點（wide > 1440px、desktop 992–1440px、tablet 768–991px、mobile < 768px）
- [x] 1.7 建立 `src/styles/slick-theme.css`（從 slick-carousel 複製或 CDN 引用），確認「Slick.js carousel integration」所需 CSS 已載入

## 2. WordPress Headless API 整合

- [x] 2.1 依照設計決策「WordPress 保持原狀，僅作內容倉庫」建立 `.env` 檔案，加入 `WP_API_BASE_URL=http://bg.nghcc.org.tw/wp2`；在 `.gitignore` 確保 `.env` 不被提交；在 `astro.config.mjs` 開啟 `vite.envPrefix`
- [x] 2.2 建立 `src/lib/wp-api.ts`，實作「WordPress REST API base configuration」：匯出 `API_BASE` 常數與 `CATEGORY_IDS` 命名常數物件（COURSE、NEWS、ARTICLE）
- [x] 2.3 在 `src/lib/wp-api.ts` 實作「Fetch posts for article listing」：`getPosts(params?)` 函式，支援 `per_page`、`page`、`categories`、`_embed` 參數，失敗時拋出含狀態碼與 URL 的 Error
- [x] 2.4 在 `src/lib/wp-api.ts` 實作「Fetch single post by slug」：`getPostBySlug(slug)` 函式，查無時回傳 `null`
- [x] 2.5 在 `src/lib/wp-api.ts` 實作「Fetch pages by slug」：`getPageBySlug(slug)` 函式，供 About 與 Contact 頁面使用
- [x] 2.6 在 `src/lib/wp-api.ts` 實作「Fetch posts by category」：`getPostsByCategory(categoryId, params?)` 函式
- [x] 2.7 在 WordPress 後台安裝 WP Webhooks 外掛，設定發布文章時 POST 至 GitHub API `repository_dispatch`，event_type 為 `wordpress-publish`
- [x] 2.8 依照設計決策「靜態重建由 GitHub Actions + Webhook 驅動」建立 `.github/workflows/rebuild.yml`，實作「Webhook-triggered static rebuild」：監聽 `repository_dispatch` 事件，執行 `npm ci && npm run build`，並部署產出至靜態主機

## 3. 導覽殼層（Header / Footer / 手機選單）

- [x] 3.1 建立 `src/layouts/BaseLayout.astro`，引入 `global.css`、`tokens.css`，並包含 `<Header />`、`<slot />`、`<Footer />` 插槽結構
- [x] 3.2 建立 `src/components/Header.astro`，實作「Fixed header with logo and horizontal navigation」：固定定位、logo 左側、水平選單中右、社群 icon（FB、YT）右側
- [x] 3.3 在 `src/components/Header.astro` 加入 `<script>` 實作「Fixed header with logo and horizontal navigation」捲動透明效果：`window.scrollY > 80` 時加入 opaque class
- [x] 3.4 在 `src/components/Header.astro` 實作「Main navigation menu structure」：五個頂層選項（關於我們、服務訊息、文章專欄、線上課程、聯絡我們）及三個 dropdown 子選單，hover 顯示
- [x] 3.5 建立 `src/components/SlideMenu.astro`，實作「Mobile slide-in hamburger menu」：右滑入 overlay、點外側遮罩關閉、開啟時 body overflow hidden
- [x] 3.6 在漢堡按鈕 `<script>` 中連接 `SlideMenu`：點擊切換 `.open` class，觸發 `translateX` 動畫
- [x] 3.7 建立 `src/components/Footer.astro`，實作「Three-column footer」：左（tagline + 社群）、中（footer logo）、右（選單 + copyright `© <year> 新竹美門社區關懷協會`），手機版垂直堆疊順序為 中 → 左 → 右

## 4. 首頁

- [x] 4.1 建立 `src/pages/index.astro`，使用 `BaseLayout.astro`；在 frontmatter 呼叫 `getPostsByCategory(CATEGORY_IDS.COURSE, { per_page: 6 })` 取得課程資料
- [x] 4.2 建立 `src/components/HeroBanner.astro`，實作「Hero banner with dual-track slider」：左側文字 Slick（3 張 slide，autoplay 5s）、右側圖片垂直 Slick，兩軌 `slickGoTo` 同步
- [x] 4.3 在 `HeroBanner.astro` 的 `<script>` 中初始化 Slick，加入 `beforeChange` callback 同步兩軌索引；確認手機版（< 992px）改為圖片在上、文字在下的直排版型
- [x] 4.4 建立 `src/components/AboutSection.astro`，實作「About section with interactive accordion cards」：標題區（ABOUT US + 中文主標）、SVG 樹、四個 accordion 卡片（desktop 2左2右，mobile 垂直堆疊）
- [x] 4.5 在 `AboutSection.astro` 的 `<script>` 中：實作點擊 accordion 展開/收合邏輯（grid-template-rows 展開），並以 GSAP ScrollTrigger 觸發樹幹 clip-path grow 動畫與葉片 stagger popIn（40ms 間距）
- [x] 4.6 建立 `src/components/CourseSection.astro`，接收 `courses` prop（來自 WordPress API），實作「Course carousel section」：水平 Slick，desktop 顯示 3 張、tablet 2 張、mobile 1 張，hover 效果（圖片 scale 1.05、標題色變 accent）
- [x] 4.7 建立 `src/components/LinkSection.astro`，實作「Quick-link card section」：3 張固定寬度卡片（文章專欄、線上課程、資源出版），含背景圖、SVG 曲線漸層遮罩、標題、英文副標、圓形箭頭按鈕，整張卡片可點擊

## 5. 內頁

- [x] 5.1 建立 `src/pages/about/index.astro`，實作「About page」：呼叫 `getPageBySlug('about')` 取得內容，渲染 `content.rendered` HTML，加入三段落標籤（緣起與宗旨、組織架構、大事紀）
- [x] 5.2 建立 `src/pages/news/index.astro` 與 `src/pages/news/[page].astro`，實作「Service / news listing page」：`getStaticPaths` 產生分頁路徑，每頁 9 筆，3 欄卡片格（含特色圖、標題、2 行摘要）
- [x] 5.3 建立 `src/pages/article/index.astro` 與 `src/pages/article/[page].astro`，實作「Article listing page」：同 news listing 邏輯，但使用 `CATEGORY_IDS.ARTICLE`
- [x] 5.4 建立 `src/pages/article/[slug].astro`，實作「Article detail page」：`getStaticPaths` 由 `getPosts({ per_page: 100 })` 產生，渲染特色圖 hero、標題、日期、`content.rendered`；slug 不存在時回傳 `Astro.redirect('/404')`
- [x] 5.5 建立 `src/pages/contact/index.astro`，實作「Contact page」：`getPageBySlug('contact')` 取得地址電話，嵌入 Google Maps iframe，靜態 HTML 表單 POST 至 Formspree endpoint（從環境變數 `FORMSPREE_ENDPOINT` 讀取）
- [x] 5.6 建立 `src/pages/404.astro`，實作「404 error page」：友善訊息 + 返回首頁連結，使用 `BaseLayout.astro`

## 6. 驗證與部署

- [x] 6.1 執行 `npm run build` 確認靜態輸出無錯誤；逐一開啟首頁、About、News、Article、Contact、404，確認樣式與互動正常
- [ ] 6.2 測試「Slick.js carousel integration」：確認首頁 Hero 兩軌輪播同步、Course 輪播可手動拖曳、LinkSection 三卡片正常顯示
- [ ] 6.3 測試「GSAP ScrollTrigger animations」：確認 About 區塊 SVG 樹動畫、各 section 進場動畫在捲動時正常觸發
- [ ] 6.4 測試 WordPress CORS 設定：在本機 dev server 呼叫 `WP_API_BASE_URL`，確認回應無 CORS 錯誤（若有，在 WordPress `.htaccess` 加入 `Access-Control-Allow-Origin` header）
- [ ] 6.5 完成靜態主機設定（Netlify / GitHub Pages / Cloudflare Pages），設定環境變數 `WP_API_BASE_URL` 與 `FORMSPREE_ENDPOINT`，完成首次部署
- [ ] 6.6 在 WordPress 發布一篇測試文章，確認「Webhook-triggered static rebuild」觸發 GitHub Actions、重建完成、新文章出現在已部署網站
