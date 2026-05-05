## ADDED Requirements

### Requirement: Color token system

The design system SHALL define CSS custom properties for the primary color palette derived from GESFPC style analysis. All components MUST reference these tokens rather than hardcoded color values.

Tokens SHALL include:
- `--color-main: #604c44` (deep brown, primary text/UI)
- `--color-accent: #e88766` (coral orange, accent/hover)
- `--color-deco-yellow: #FFCC00` (decoration blob)
- `--color-deco-pink: #FFD9CC` (decoration blob)
- `--color-text-body: #565656`
- `--color-text-dark: #1d1d1d`
- `--color-bg: #ffffff`

#### Scenario: Token usage in components

- **WHEN** a component sets a foreground color
- **THEN** it SHALL use `var(--color-main)` or `var(--color-accent)`, not `#604c44` directly

### Requirement: Typography system

The design system SHALL configure two font families:
- `"Noto Sans TC"` as the default body font for all Chinese and Latin text
- `"Outfit"` as the display font for numerals and English labels

Both fonts SHALL be loaded from Google Fonts via `<link>` in the base layout.

#### Scenario: Font loading in base layout

- **WHEN** any page renders
- **THEN** the `<head>` SHALL include preconnect links for `fonts.googleapis.com` and `fonts.gstatic.com`, plus the combined Google Fonts URL for Noto Sans TC and Outfit

### Requirement: Organic blob shape animations

The design system SHALL provide reusable CSS keyframe animations for organic blob shapes used as decorative backgrounds throughout the site.

Blob animations SHALL include:
- `lavaBlob`: morphing border-radius animation (12–14s infinite)
- `lavaBlobSoft`: subtle slower variant (6s infinite)
- `branchSway`: pendulum-like rotation for leaf decorations (5s ease-in-out infinite)
- `slideUpAnimation`: element entrance from below with opacity fade-in

#### Scenario: Blob animation applied to a section

- **WHEN** a `.deco` blob element is rendered inside a section
- **THEN** it SHALL have `border-radius` defined with 4-value shorthand and the `lavaBlob` animation applied via `animation` property

### Requirement: Slick.js carousel integration

The design system SHALL provide Slick.js (v1.8+) as the project-wide carousel library. jQuery SHALL be included as Slick's dependency. Both libraries MUST be loaded before any carousel initialization script runs.

#### Scenario: Carousel initializes on page load

- **WHEN** a page containing a `.slickClsList` element finishes loading
- **THEN** Slick SHALL be initialized on that element with the configuration defined in the component's inline `<script>` tag

### Requirement: GSAP ScrollTrigger animations

The design system SHALL load GSAP core and ScrollTrigger plugin via CDN or npm package. Scroll-triggered animations MUST be registered using `gsap.registerPlugin(ScrollTrigger)` before use.

Each animated section SHALL define a `trigger` pointing to the section element, with `start: "top 80%"` as the default trigger point.

#### Scenario: Section enters viewport

- **WHEN** a section with scroll animation crosses the 80% viewport threshold from the top
- **THEN** the section's elements SHALL animate in using the defined GSAP timeline (translateY from 40px to 0, opacity from 0 to 1, duration 0.8s)

### Requirement: Responsive breakpoints

The design system SHALL define a consistent set of breakpoints used across all components:

| Breakpoint name | Width      |
|-----------------|------------|
| wide            | > 1440px   |
| desktop         | 992–1440px |
| tablet          | 768–991px  |
| mobile          | < 768px    |

#### Scenario: Layout changes at tablet breakpoint

- **WHEN** viewport width is below 768px
- **THEN** horizontal flex layouts SHALL switch to vertical stacking (flex-direction: column)
