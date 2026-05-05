## ADDED Requirements

### Requirement: Fixed header with logo and horizontal navigation

The site SHALL render a fixed header bar visible on all pages. The header SHALL contain:
- Logo image on the left (`src/assets/logo.svg`)
- Horizontal navigation menu in the center-right (desktop only, hidden on mobile)
- Social media icon links (Facebook, YouTube) on the right
- Hamburger trigger button on the right (visible only on mobile / tablet)

The header background SHALL become opaque white after the user scrolls past 80px from the top. Before scrolling, the header background SHALL be transparent.

#### Scenario: Header transparency on page top

- **WHEN** the page scroll position is 0
- **THEN** the header element SHALL have `background-color: transparent`

#### Scenario: Header becomes opaque on scroll

- **WHEN** user scrolls down past 80px
- **THEN** the header element SHALL add a CSS class that sets `background-color: #fff` and a box shadow

### Requirement: Main navigation menu structure

The horizontal navigation SHALL display the following top-level items matching the GESFPC structure adapted for 美門:

1. 關於我們 (with dropdown: 緣起與宗旨, 組織架構, 大事紀)
2. 服務訊息 (with dropdown: 社區服務, 輔導協談, 培訓課程)
3. 文章專欄 (with dropdown: 活動花絮, 生命分享, 資訊公告)
4. 線上課程
5. 聯絡我們

Dropdown menus SHALL appear on hover (desktop) using CSS transitions.

#### Scenario: Dropdown appears on hover

- **WHEN** user hovers a menu item that has a dropdown
- **THEN** the submenu list SHALL become visible with a CSS slide-down transition (max-height or opacity)

#### Scenario: All items visible on desktop

- **WHEN** viewport is wider than 992px
- **THEN** all top-level menu items SHALL be rendered in a single horizontal row

### Requirement: Mobile slide-in hamburger menu

On viewports narrower than 992px, a hamburger button SHALL be shown in the header. Clicking it SHALL open a full-screen overlay panel sliding in from the right. The panel SHALL display the full navigation tree (including dropdowns expandable by tap) and social media links.

#### Scenario: Hamburger opens the side menu

- **WHEN** user taps the hamburger button
- **THEN** a `.slideMenuArea` overlay SHALL slide in from the right with `transform: translateX(0)` transition
- **THEN** the body SHALL receive `overflow: hidden` to prevent background scroll

#### Scenario: Tapping outside the menu closes it

- **WHEN** user taps the dark overlay mask next to the open menu
- **THEN** the slide menu SHALL animate out and body overflow SHALL be restored

### Requirement: Three-column footer

The footer SHALL be rendered on all pages with three columns:
- Left: A tagline quote + social media icon links (Facebook, YouTube)
- Center: Footer logo (white version of the logo SVG)
- Right: Condensed navigation menu (same items as header, no dropdowns) + copyright line

Copyright text SHALL read: `© <current year> 新竹美門社區關懷協會 All Rights Reserved.`

#### Scenario: Footer renders on all pages

- **WHEN** any page using `BaseLayout.astro` is rendered
- **THEN** the footer element SHALL be present with all three columns visible on desktop

#### Scenario: Footer collapses on mobile

- **WHEN** viewport is narrower than 768px
- **THEN** the three footer columns SHALL stack vertically in order: center (logo), left (tagline + social), right (nav + copyright)
