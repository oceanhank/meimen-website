## ADDED Requirements

### Requirement: About page

The About page (`/about`) SHALL render static content fetched from the WordPress page with slug `about`. The page SHALL include a page-level hero banner with the page title, followed by the rendered HTML content from `content.rendered`. A tabbed or sectioned layout SHALL separate the three sub-sections: 緣起與宗旨, 組織架構, 大事紀.

#### Scenario: About page content renders

- **WHEN** a user navigates to `/about`
- **THEN** the page SHALL display the WordPress page title and full body content
- **THEN** the page SHALL use `BaseLayout.astro` (header + footer included)

### Requirement: Service / news listing page

The service listing page (`/news`) SHALL render a paginated grid of posts from the WordPress `services` or `news` category. Each post card SHALL show: featured image, title, excerpt (truncated to 2 lines), and a "read more" link.

The page SHALL support URL-based pagination via `/news/page/2`, `/news/page/3` etc., generated statically using `getStaticPaths()`.

#### Scenario: Listing shows 9 posts per page

- **WHEN** the `/news` page is generated at build time
- **THEN** it SHALL request `getPostsByCategory(CATEGORY_IDS.NEWS, { per_page: 9, page: 1 })`
- **THEN** it SHALL render exactly 9 post cards in a 3-column grid on desktop

#### Scenario: Pagination links are present

- **WHEN** the total post count exceeds 9
- **THEN** the page SHALL render numbered pagination links corresponding to the total pages

### Requirement: Article listing page

The article listing page (`/article`) SHALL render a paginated grid of posts from the `article` category. Layout and pagination behavior SHALL match the service listing page requirement.

#### Scenario: Article listing page loads

- **WHEN** a user navigates to `/article`
- **THEN** posts from `CATEGORY_IDS.ARTICLE` SHALL be displayed in a responsive card grid

### Requirement: Article detail page

The article detail page (`/article/[slug]`) SHALL render the full content of a single WordPress post. The page SHALL include: featured image as a full-width hero, post title, formatted date, post body HTML (`content.rendered`), and a "back to listing" link.

Static paths SHALL be generated at build time by calling `getPosts({ per_page: 100 })` and mapping slugs.

#### Scenario: Valid slug renders post

- **WHEN** a user navigates to `/article/my-post-slug`
- **THEN** the page SHALL display the post's full title and `content.rendered` HTML
- **THEN** the page SHALL use `BaseLayout.astro`

#### Scenario: Invalid slug returns 404

- **WHEN** a user navigates to a slug that does not exist in WordPress
- **THEN** Astro SHALL render the `404.astro` page

### Requirement: Contact page

The contact page (`/contact`) SHALL render static contact information fetched from the WordPress page with slug `contact`. The page SHALL include:
- Organization address and phone number (from `content.rendered`)
- An embedded Google Map iframe
- A contact form (static HTML form posting to a third-party form service such as Formspree)

#### Scenario: Contact page displays form and map

- **WHEN** a user navigates to `/contact`
- **THEN** the page SHALL render both the Google Map embed and the contact form
- **THEN** the form submission SHALL POST to the configured Formspree endpoint

#### Scenario: Form submission success

- **WHEN** user submits the form with valid fields (name, email, message)
- **THEN** Formspree SHALL redirect or display a success confirmation to the user

### Requirement: 404 error page

The site SHALL include a custom `404.astro` page that is served for all unmatched routes. The page SHALL display a friendly message and a link back to the home page, using `BaseLayout.astro`.

#### Scenario: Unmatched route shows custom 404

- **WHEN** a user navigates to a URL that has no matching static page
- **THEN** the HTTP response SHALL be 404 and the page SHALL render the custom 404 content with header and footer
