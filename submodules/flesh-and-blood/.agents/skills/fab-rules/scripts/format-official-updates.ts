#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./node-shims.d.ts" />

/**
 * Normalizes the already-downloaded official FAB update archive.
 *
 * This script never fetches network data. It adds reliable document titles and
 * provenance front matter, then applies conservative Markdown whitespace and
 * list formatting so each source stays pleasant to read and cheap to search.
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type ManifestDocument = {
  file: string;
  title: string;
  source: string;
  htmlSha256?: string;
};

type Manifest = {
  fetchedAt: string;
  documents: Record<string, ManifestDocument[]>;
};

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const archive = join(root, "references", "official-updates");
const checkOnly = process.argv.includes("--check");

function quoteYaml(value: string): string {
  return JSON.stringify(value);
}

function splitFrontMatter(markdown: string): string {
  if (!markdown.startsWith("---\n")) return markdown.trim();
  const end = markdown.indexOf("\n---\n", 4);
  if (end === -1) throw new Error("Unterminated front matter");
  return markdown.slice(end + "\n---\n".length).trim();
}

function normalizeBody(body: string): string {
  return body
    .replace(/\r\n/g, "\n")
    .replace(
      /^Release Date: (.+?) Set Code: (.+?) Languages: (.+?) Cards in Set: (.+?) Additional Notes:$/gm,
      "## Release details\n\n- Release date: $1\n- Set code: $2\n- Languages: $3\n- Cards in set: $4\n\n## Additional notes",
    )
    .replace(/^Errata:$/gm, "### Errata")
    .replace(/^(- .+)\n\n(?=- )/gm, "$1\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderDocument(document: ManifestDocument, fetchedAt: string, original: string): string {
  let body = normalizeBody(splitFrontMatter(original));
  if (!body.startsWith(`# ${document.title}\n`)) {
    body = body.startsWith("# ")
      ? body.replace(/^# .+$/m, `# ${document.title}`)
      : `# ${document.title}\n\n${body}`;
  }
  const hashLine = document.htmlSha256 ? `content_sha256: ${document.htmlSha256}\n` : "";
  return (
    "---\n" +
    `title: ${quoteYaml(document.title)}\n` +
    `source: ${document.source}\n` +
    `archived_at: ${fetchedAt}\n` +
    hashLine +
    "---\n\n" +
    `${body}\n`
  );
}

function validateDocument(document: ManifestDocument, markdown: string): void {
  if (!markdown.startsWith(`---\ntitle: ${quoteYaml(document.title)}\n`)) {
    throw new Error(`${document.file}: missing normalized title front matter`);
  }
  if (!markdown.includes(`source: ${document.source}\n`)) {
    throw new Error(`${document.file}: missing source provenance`);
  }
  if (!markdown.includes(`\n# ${document.title}\n`)) {
    throw new Error(`${document.file}: missing H1 title`);
  }
  if (/\n{3,}/.test(markdown)) {
    throw new Error(`${document.file}: contains excessive blank lines`);
  }
}

async function main(): Promise<void> {
  const manifest = JSON.parse(await readFile(join(archive, "manifest.json"), "utf8")) as Manifest;
  const documents = Object.values(manifest.documents).flat();
  for (const document of documents) {
    const path = join(root, document.file);
    const original = await readFile(path, "utf8");
    const formatted = renderDocument(document, manifest.fetchedAt, original);
    if (checkOnly) {
      validateDocument(document, original);
    } else if (formatted !== original) {
      await writeFile(path, formatted);
    }
  }
  console.log(
    `${checkOnly ? "Validated" : "Formatted"} ${documents.length} local official-update documents.`,
  );
}

await main();
