## ADDED Requirements

### Requirement: WordPress REST API base configuration

The integration SHALL read the WordPress base URL from an environment variable `WP_API_BASE_URL` (e.g., `http://bg.nghcc.org.tw/wp2`). All API calls MUST be constructed by appending REST API paths to this base URL. The variable SHALL be defined in `.env` for local development and in the host platform's environment settings for production.

#### Scenario: API base URL is consumed

- **WHEN** `src/lib/wp-api.ts` is imported
- **THEN** it SHALL export helper functions that prefix all fetch URLs with `import.meta.env.WP_API_BASE_URL + '/wp-json/wp/v2'`

### Requirement: Fetch posts for article listing

The integration SHALL provide a `getPosts(params?)` function that fetches published posts from the WordPress REST API. The function SHALL support optional query parameters including `per_page`, `page`, `categories`, and `_embed`.

#### Scenario: Fetching posts for the article listing page

- **WHEN** `getPosts({ per_page: 10 })` is called at Astro build time
- **THEN** it SHALL return an array of post objects each containing at minimum: `id`, `slug`, `title.rendered`, `excerpt.rendered`, `date`, `_embedded['wp:featuredmedia']`

#### Scenario: API request fails

- **WHEN** the WordPress API returns a non-2xx status or a network error occurs
- **THEN** `getPosts` SHALL throw an error with the HTTP status code and URL included in the message, allowing Astro's build to fail with a visible error

### Requirement: Fetch single post by slug

The integration SHALL provide a `getPostBySlug(slug: string)` function that returns a single post object matching the given slug.

#### Scenario: Valid slug returns post

- **WHEN** `getPostBySlug('lorem-ipsum')` is called
- **THEN** it SHALL query `/wp/v2/posts?slug=lorem-ipsum&_embed` and return the first result object

#### Scenario: Slug not found returns null

- **WHEN** `getPostBySlug('nonexistent-slug')` is called and the API returns an empty array
- **THEN** the function SHALL return `null`

### Requirement: Fetch pages by slug

The integration SHALL provide a `getPageBySlug(slug: string)` function that fetches a WordPress page by its slug, used for static informational pages (About, Contact).

#### Scenario: About page content fetched

- **WHEN** `getPageBySlug('about')` is called
- **THEN** it SHALL return a page object with `title.rendered` and `content.rendered` fields populated

### Requirement: Fetch posts by category

The integration SHALL provide a `getPostsByCategory(categoryId: number, params?)` function. Category IDs for service sections (articles, courses, news) SHALL be documented in `src/lib/wp-api.ts` as named constants.

#### Scenario: Fetching course-type posts

- **WHEN** `getPostsByCategory(CATEGORY_IDS.COURSE, { per_page: 6 })` is called
- **THEN** it SHALL query `/wp/v2/posts?categories=<id>&per_page=6&_embed` and return matching posts

### Requirement: Webhook-triggered static rebuild

The integration SHALL support triggering an Astro static rebuild when WordPress content is published or updated. A GitHub Actions workflow file SHALL exist at `.github/workflows/rebuild.yml` that is triggered by a `repository_dispatch` event of type `wordpress-publish`.

#### Scenario: WordPress publish triggers rebuild

- **WHEN** WordPress fires the `publish_post` hook (via WP Webhooks plugin)
- **THEN** it SHALL send a POST request to the GitHub API `repository_dispatch` endpoint with `event_type: "wordpress-publish"`
- **THEN** GitHub Actions SHALL run `npm run build` and deploy the output

#### Scenario: Build failure is visible

- **WHEN** `npm run build` exits with a non-zero code
- **THEN** the GitHub Actions job SHALL fail with a visible error status, and the previous deployed version SHALL remain live
