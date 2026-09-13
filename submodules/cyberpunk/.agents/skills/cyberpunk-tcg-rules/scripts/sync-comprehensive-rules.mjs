#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceUrl = "https://api.netdeck.gg/api/cyberpunk/comprehensive-rules";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(scriptDir, "..");
const referencesDir = resolve(skillDir, "references");
const indexDir = resolve(skillDir, "indexes");

function normalize(value) {
  return value.replace(/\s+/g, " ").trim();
}

function renderMirror({ game, updated_at: updatedAt, items }) {
  const lines = [
    `# ${game.name} Comprehensive Rules`,
    "",
    "> Official source: [Cyberpunk TCG Comprehensive Rules](https://cyberpunktcg.com/comprehensive-rules)",
    `> Downloaded from the official rules reader API on ${updatedAt}.`,
    "",
    "This local mirror preserves the official rule numbers and Markdown content. Refresh it with `scripts/sync-comprehensive-rules.mjs`; use the index to load only the sections relevant to a question.",
  ];

  for (const item of items) {
    const level = Math.min(Math.max(item.depth + 1, 2), 6);
    const title = normalize(item.title);
    const prefix = item.display_number ? `${item.display_number} — ` : "";
    lines.push("", `${"#".repeat(level)} ${prefix}${title}`);
    const body = item.body_markdown.trim();
    if (body && normalize(body.replace(/[*_`]/g, "")) !== title) {
      lines.push("", body);
    }
  }

  return `${lines
    .join("\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")}\n`;
}

function renderTerms(mirror) {
  const start = mirror.indexOf("## 11 — TERMS\n");
  const end = mirror.indexOf("\n## CREDITS", start);
  if (start < 0 || end < 0) throw new Error("Could not locate the TERMS chapter.");
  return [
    "# Cyberpunk TCG Terms and Keywords",
    "",
    "> Extracted from the local official comprehensive-rules mirror. Cite the numbered rule in the source for implementation or player-facing rulings.",
    "",
    mirror.slice(start, end).trim(),
    "",
  ].join("\n");
}

function renderIndex({ updated_at: updatedAt, items }) {
  const chapters = items.filter((item) => item.parent_id === null && item.display_number);
  const rows = chapters.map(
    (item) =>
      `| ${item.display_number} | ${normalize(item.title)} | See chapter ${item.display_number} in the source mirror |`,
  );
  return [
    "# Cyberpunk TCG Comprehensive Rules Index",
    "",
    "> Source mirror: `references/comprehensive-rules.md`, downloaded from the official [Comprehensive Rules](https://cyberpunktcg.com/comprehensive-rules) reader on " +
      updatedAt +
      ".",
    "",
    "Read `references/glossary.md` first. Then use the chapter map below to locate the narrowest applicable rule by heading, term, or numbered citation.",
    "",
    "| Rules | Topic | Retrieval |",
    "| --- | --- | --- |",
    ...rows,
    "",
    "Use `rg -n '^(##|###) .*<term-or-rule-number>' references/comprehensive-rules.md` to find an exact passage. Cite the displayed rule number, not a heading line or this index.",
    "",
  ].join("\n");
}

const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Official rules download failed: ${response.status}`);
const document = await response.json();
if (!Array.isArray(document.items) || document.items.length === 0) {
  throw new Error("Official rules response has no rule items.");
}

const mirror = renderMirror(document);
await mkdir(referencesDir, { recursive: true });
await mkdir(indexDir, { recursive: true });
await Promise.all([
  writeFile(resolve(referencesDir, "comprehensive-rules.md"), mirror),
  writeFile(resolve(referencesDir, "glossary.md"), renderTerms(mirror)),
  writeFile(resolve(indexDir, "master-index.md"), renderIndex(document)),
]);
console.log(
  `Synced ${document.items.length} official Cyberpunk TCG rules updated ${document.updated_at}.`,
);
