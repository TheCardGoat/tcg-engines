#!/usr/bin/env node

/**
 * Mirrors the public Grand Archive comprehensive-rules GitBook as Markdown.
 *
 * The page index is the source of truth, so newly published rule pages are
 * imported on the next run without maintaining a hand-written URL list.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const site = "https://rules.gatcg.com";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const referenceDirectory = resolve(
  scriptDirectory,
  "../references/grand-archieve-comprehensive-rules",
);
const concurrency = 8;

function outputPathFor(pathname) {
  if (pathname === "/") return resolve(referenceDirectory, "changelog.md");

  return resolve(referenceDirectory, `${pathname.replace(/^\//, "")}.md`);
}

function removeGitBookPreamble(markdown) {
  return markdown.replace(/^> For the complete documentation index,[^\n]*\n\n/, "");
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);

  return response.json();
}

async function fetchMarkdown(page) {
  const response = await fetch(`${site}${page.pathname}.md`);
  if (!response.ok) {
    throw new Error(`${page.pathname}.md: HTTP ${response.status}`);
  }

  const markdown = removeGitBookPreamble(await response.text());
  if (!markdown.startsWith("# ")) {
    throw new Error(`${page.pathname}.md did not return a Markdown document`);
  }

  const outputPath = outputPathFor(page.pathname);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, markdown.endsWith("\n") ? markdown : `${markdown}\n`);
}

async function runPool(items, worker) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex++];
      await worker(item);
    }
  });

  await Promise.all(workers);
}

const index = await fetchJson(`${site}/~gitbook/site-index`);
if (!Array.isArray(index.pages) || index.pages.length === 0) {
  throw new Error("The official site index contains no pages.");
}

await runPool(index.pages, fetchMarkdown);
console.log(`Synced ${index.pages.length} Grand Archive rules pages to ${referenceDirectory}`);
