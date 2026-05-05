import { defineConfig } from 'astro/config';

// 預覽用：部署到 GitHub Pages 時 base 設為 repo 名稱
// 正式上線後改回 '/' 或移除 base
const isGHPages = process.env.DEPLOY_TARGET === 'gh-pages';

export default defineConfig({
  site: isGHPages ? 'https://oceanhank.github.io' : 'https://nghcc.org.tw',
  base: isGHPages ? '/meimen-website' : '/',
  output: 'static',
  vite: {
    envPrefix: ['WP_', 'FORMSPREE_'],
  },
});
