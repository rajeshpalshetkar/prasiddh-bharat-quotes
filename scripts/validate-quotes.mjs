import { readFile } from "node:fs/promises";

const index = JSON.parse(await readFile("data/quotes-index.json", "utf8"));
const ids = new Set();
const slugs = new Set();
const articleGroups = new Map();
const errors = [];

for (const quote of index.quotes ?? []) {
  if (!Number.isInteger(quote.id) || quote.id < 1 || quote.id > 1000) errors.push(`Invalid ID: ${quote.id}`);
  if (ids.has(quote.id)) errors.push(`Duplicate ID: ${quote.id}`);
  ids.add(quote.id);
  if (!quote.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(quote.slug)) errors.push(`Invalid slug for ID ${quote.id}`);
  if (slugs.has(quote.slug)) errors.push(`Duplicate slug: ${quote.slug}`);
  slugs.add(quote.slug);
  if (!quote.articleFile) errors.push(`Missing articleFile for ID ${quote.id}`);
  else {
    if (!articleGroups.has(quote.articleFile)) articleGroups.set(quote.articleFile, new Set());
    articleGroups.get(quote.articleFile).add(quote.id);
  }
  if (!quote.title || !quote.quote) errors.push(`Missing title/quote for ID ${quote.id}`);
  if (!quote.publication?.status || !["draft", "published"].includes(quote.publication.status)) errors.push(`Invalid publication status for ID ${quote.id}`);
}

for (const [file, expectedIds] of articleGroups) {
  let batch;
  try { batch = JSON.parse(await readFile(file, "utf8")); }
  catch { errors.push(`Cannot read article batch: ${file}`); continue; }
  const found = new Set();
  for (const article of batch.articles ?? []) {
    if (found.has(article.id)) errors.push(`Duplicate article ID ${article.id} in ${file}`);
    found.add(article.id);
    if (!article.content || !article.content.introduction || !article.content.meaning) errors.push(`Incomplete article content for ID ${article.id}`);
  }
  for (const id of expectedIds) if (!found.has(id)) errors.push(`Index ID ${id} has no article in ${file}`);
}
if (errors.length) {
  console.error(errors.map(e => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log(`Validated ${index.quotes.length} quote index records across ${articleGroups.size} article batch(es).`);
