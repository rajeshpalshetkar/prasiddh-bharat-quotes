# Prasiddh Bharat Quotes

Marathi inspirational quotes and long-form reflections for **Prasiddh Bharat**.

## Copyright and usage

Copyright © 2026 Prasiddh Bharat. All Rights Reserved.

No permission is granted to copy, reproduce, modify, redistribute, republish, or commercially use this repository or its contents without prior written permission from the copyright owner. No open-source license is provided.

## Repository structure

- `data/quotes-index.json` — lightweight index used for listing, search and categories
- `data/articles/batch-001.json` — full article content for quote IDs 1–100
- `data/articles/batch-002.json` through `batch-010.json` — reserved batches for IDs 101–1000
- `data/quotes.json` — legacy combined backup; do not use it as the active data source
- `assets/quotes.js` — index loading, search, category filter, article loading and pagination
- `assets/quotes.css` — responsive navy-and-gold presentation
- `blogger-page.html` — embed code for a Blogger Page
- `scripts/validate-quotes.mjs` — validates IDs, slugs and article references
- `.github/workflows/validate-quotes.yml` — runs validation when data changes

## How the site works

1. Blogger loads the small `quotes-index.json` file.
2. The listing shows 20 cards at a time. The “आणखी सुविचार पहा” button reveals the next 20 without downloading full article text.
3. Full article content is fetched only when a reader opens a quote. The browser caches each article batch for the current page session.
4. Only records with `publication.status` equal to `published` appear on the public page. Draft records remain hidden.

## Add a quote

1. Add the listing metadata to `data/quotes-index.json` with a unique numeric `id`, unique URL-safe `slug`, SEO fields, publication status and the correct `articleFile`.
2. Add its full `content` object to the referenced article batch file under `articles`, using the same numeric ID.
3. Keep batches grouped by 100 IDs: 1–100 in `batch-001.json`, 101–200 in `batch-002.json`, and so on.
4. Run `node scripts/validate-quotes.mjs` before committing.
5. Set `publication.status` to `published` only after editorial approval.

## Blogger setup

Open Blogger → Pages → edit the inspirational quotes page → HTML view. Replace the complete page HTML with the current contents of `blogger-page.html`, then publish/update. The page uses versioned asset URLs to reduce stale browser/CDN cache issues.

## Important SEO note

This is a JavaScript-powered listing and article viewer embedded in one Blogger Page. Changing the browser title when an article opens does not guarantee a separately crawlable, indexable URL and unique server-rendered metadata for every article. For strong per-article SEO at 1,000 entries, publish each article as an individual Blogger Post (or use a server-rendered/static page architecture) and use this quote directory as the discovery interface.

## Security

This is a public repository. Do not store access tokens, passwords, private data or unpublished confidential material here.
