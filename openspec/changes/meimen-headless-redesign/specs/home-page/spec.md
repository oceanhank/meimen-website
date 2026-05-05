## ADDED Requirements

### Requirement: Hero banner with dual-track slider

The home page SHALL render a full-viewport-height hero section divided into two tracks:
- Left track: a Slick text carousel cycling through 3–5 headline messages with title and body text
- Right track: a vertical Slick image carousel showing rounded-rectangle photographs

Both carousels SHALL autoplay and share a synchronized index so that text and image advance together. Navigation arrows SHALL be visible on desktop; on mobile, only the image carousel arrow is shown.

#### Scenario: User views hero on desktop

- **WHEN** the home page loads on a viewport wider than 992px
- **THEN** the hero section SHALL occupy 100vh, the left text carousel and right image carousel SHALL be side by side, and the first slide SHALL animate in with a slideUp entrance

#### Scenario: User views hero on mobile

- **WHEN** the home page loads on a viewport narrower than 992px
- **THEN** the image carousel SHALL stack above the text carousel, and both SHALL collapse to auto height

#### Scenario: Hero carousels advance automatically

- **WHEN** 5 seconds elapse without user interaction
- **THEN** both left and right carousels SHALL advance to the next slide simultaneously

### Requirement: About section with interactive accordion cards

The home page SHALL render an "About" section containing:
- A centered title box with Chinese subtitle and English caption ("ABOUT US")
- An animated SVG tree illustration that triggers a grow animation on scroll entry
- Four accordion cards arranged around the tree on desktop (2 left, 2 right); stacked vertically on mobile
- Each card shows a numbered title; clicking expands a detail paragraph

#### Scenario: User clicks an accordion card

- **WHEN** user clicks a collapsed accordion card
- **THEN** the card SHALL expand to show the detail text using a CSS grid-row expand transition (grid-template-rows: 0fr → 1fr)
- **THEN** all other open cards SHALL collapse simultaneously

#### Scenario: SVG tree animates on scroll entry

- **WHEN** the about section enters the viewport for the first time
- **THEN** the tree trunk SHALL clip-path grow from bottom to top, branches SHALL fade in, and leaf nodes SHALL pop in sequentially with staggered delays of 40ms each

### Requirement: Course carousel section

The home page SHALL render a "Course" section (教牧輔導門訓) with:
- A section title box (subtitle: "COURSE")
- A horizontal Slick carousel of course cards, showing 3 cards at once on desktop, 2 on tablet, 1 on mobile
- Each card contains: a rounded-rectangle image, a numbered label, a title with dashed underline, and a 3-line excerpt
- Clicking a card navigates to the corresponding course detail URL

#### Scenario: Course card hover effect on desktop

- **WHEN** user hovers a course card on a desktop viewport
- **THEN** the card image SHALL scale to 1.05x, the title SHALL change color to `--color-accent`, and the dashed underline SHALL animate to an orange dashed line

#### Scenario: Course data comes from WordPress

- **WHEN** Astro builds the home page
- **THEN** the course carousel SHALL render using posts fetched from `getPostsByCategory(CATEGORY_IDS.COURSE, { per_page: 6 })`

### Requirement: Quick-link card section

The home page SHALL render a "Link Area" section containing exactly 3 full-bleed image cards linking to major site sections:
- 文章專欄 (Article Column)
- 線上課程 (Graceful Vision)  
- 資源出版 (Resource Library)

Each card SHALL show a background photo, a title, an English subtitle, a circular arrow button, and a curved SVG gradient overlay at the bottom.

#### Scenario: Quick-link card displayed

- **WHEN** the link section renders
- **THEN** all 3 cards SHALL be visible simultaneously on desktop without a carousel control

#### Scenario: Quick-link card navigates on click

- **WHEN** user clicks anywhere on a link card
- **THEN** the browser SHALL navigate to the card's target URL
