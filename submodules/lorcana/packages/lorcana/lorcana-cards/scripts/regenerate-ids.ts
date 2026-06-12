#!/usr/bin/env bun
/**
 * One-off script: regenerate card ids for all cards in packages/lorcana-cards/src/cards.
 *
 * New ids: 3 chars, case-sensitive, alphanumeric + special chars, unique.
 *
 * Usage: bun run packages/lorcana-cards/scripts/regenerate-ids.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

const CARDS_ROOT = path.resolve(import.meta.dir, "../src/cards");

// 3-char id charset: 0-9, A-Z, a-z, and safe special - _ .
const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.";
const L = CHARS.length;

function randomId(): string {
  return (
    CHARS[Math.floor(Math.random() * L)]! +
    CHARS[Math.floor(Math.random() * L)]! +
    CHARS[Math.floor(Math.random() * L)]!
  );
}

function nextUniqueId(used: Set<string>): string {
  const maxAttempts = 1_000;

  for (let attempts = 0; attempts < maxAttempts; attempts += 1) {
    const id = randomId();
    if (used.has(id)) {
      continue;
    }
    used.add(id);
    return id;
  }

  throw new Error(`Unable to generate a unique id after ${maxAttempts} attempts.`);
}

/** Match a line containing id: "..." — capture leading whitespace and the quoted value */
const ID_LINE_RE = /^(\s*)id:\s*"([^"]*)"\s*,?\s*$/gm;

/**
 * Find the card-level id line (the one with minimum indent) and return
 * { fullLine, indent, value } or null if none.
 */
function findCardIdLine(
  content: string,
): { fullLine: string; indent: string; value: string } | null {
  let best: { fullLine: string; indent: string; value: string } | null = null;
  let minIndent = Number.POSITIVE_INFINITY;
  ID_LINE_RE.lastIndex = 0;
  for (const match of content.matchAll(ID_LINE_RE)) {
    const fullLine = match[0];
    if (!fullLine) {
      continue;
    }
    const indent = match[1]!;
    const value = match[2]!;
    if (indent.length < minIndent) {
      minIndent = indent.length;
      best = { fullLine, indent, value };
    }
  }
  return best;
}

function collectCardFiles(root: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(root, e.name);
    if (e.isDirectory()) {
      files.push(...collectCardFiles(full));
      continue;
    }
    if (
      e.isFile() &&
      e.name.endsWith(".ts") &&
      !e.name.endsWith(".test.ts") &&
      e.name !== "index.ts"
    ) {
      files.push(full);
    }
  }
  return files;
}

function main(): void {
  const cardFiles = collectCardFiles(CARDS_ROOT);
  const usedIds = new Set<string>();
  const mapping: Array<{ file: string; oldId: string; newId: string }> = [];
  let updated = 0;
  let skipped = 0;

  for (const filePath of cardFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = findCardIdLine(content);
    if (!match) {
      skipped++;
      continue;
    }
    const newId = nextUniqueId(usedIds);
    const newLine = `${match.indent}id: "${newId}",`;
    const newContent = content.replace(match.fullLine, newLine);
    if (newContent === content) {
      skipped++;
      continue;
    }
    fs.writeFileSync(filePath, newContent, "utf-8");
    mapping.push({
      file: path.relative(CARDS_ROOT, filePath),
      oldId: match.value,
      newId,
    });
    updated++;
  }

  const mappingPath = path.resolve(import.meta.dir, "../src/data/id-regenerate-mapping.json");
  fs.mkdirSync(path.dirname(mappingPath), { recursive: true });
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), "utf-8");

  console.log(`Updated ${updated} card ids. Skipped ${skipped} files.`);
  console.log(`Mapping written to ${path.relative(process.cwd(), mappingPath)}`);
}

main();
