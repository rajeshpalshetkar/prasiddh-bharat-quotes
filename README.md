# Prasiddh Bharat Quotes

Marathi inspirational quotes and long-form reflections for **Prasiddh Bharat**.

## Copyright and usage

Copyright © 2026 Prasiddh Bharat. All Rights Reserved.

No permission is granted to copy, reproduce, modify, redistribute, republish, or commercially use this repository or its contents without prior written permission from the copyright owner. No open-source license is provided.

## Repository structure

- `data/quotes.json` — structured quote and article data
- `assets/quotes.css` — responsive navy-and-gold presentation
- `assets/quotes.js` — search, category filter, article view, copy and share
- `blogger-page.html` — embed code for a Blogger Page

## Add to Blogger

1. Open Blogger and create or edit a Page (not a Post).
2. Switch the editor to **HTML view**.
3. Copy the complete contents of `blogger-page.html` into the page.
4. Publish the page and test on desktop and mobile.

The page loads published records from the public JSON file. Records whose `publication.status` is `draft` are not displayed.

## Publish a quote

Add a new object to the `quotes` array in `data/quotes.json`. Give it a unique numeric `id` and unique URL-safe `slug`. Set `publication.status` to `published` only after editorial approval. Keep it as `draft` while preparing.

## Data format

Each quote supports `id`, `slug`, `title`, `quote`, `category`, `tags`, `language`, `author`, `seo`, `content`, and `publication`.

## Important

This is a public repository: its contents are readable by anyone. Do not store access tokens, passwords, private data, or unpublished confidential material here.
