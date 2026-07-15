#!/usr/bin/env bun
/**
 * One-off script: add canonicalId to card files that don't have it.
 * Uses card id from file (shortId when present); otherwise derives from path/set/cardNumber.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CARDS_ROOT = join(import.meta.dir, "..", "src", "cards");

function* walkCardFiles(dir: string, prefix = ""): Generator<string> {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name);
    const rel = prefix ? `${prefix}/${name.name}` : name.name;
    if (name.isDirectory() && !name.name.startsWith(".")) {
      yield* walkCardFiles(path, rel);
    } else if (
      name.isFile() &&
      name.name.endsWith(".ts") &&
      !name.name.endsWith(".test.ts") &&
      name.name !== "index.ts" &&
      name.name !== "cards.ts"
    ) {
      yield path;
    }
  }
}

function deriveCanonicalId(content: string, filePath: string): string {
  const idMatch = content.match(/\bid:\s*["']([^"']+)["']/);
  const idFromContent = idMatch ? idMatch[1]! : "";
  if (idFromContent.length === 3 && /^[0-9a-zA-Z_-]+$/.test(idFromContent)) return idFromContent;
  const pathParts = filePath
    .replace(/^.*\/src\/cards\/?/, "")
    .replace(/\.ts$/, "")
    .split("/");
  const set = pathParts[0] ?? "000";
  const typeDir = pathParts[1] ?? "";
  const filename = pathParts[2] ?? "";
  const numMatch = filename.match(/^(\d+)/);
  const cardNum = numMatch ? numMatch[1] : "0";
  const fallbackId = idFromContent || `${typeDir}-${cardNum}`;
  return `cn_${set}-${fallbackId}`;
}

function addCanonicalId(content: string, filePath: string): string | null {
  if (/canonicalId\s*:/.test(content)) return null;
  const canonicalId = deriveCanonicalId(content, filePath);
  const insert = `  canonicalId: "${canonicalId}",\n`;
  const re = /(export const \w+: (?:ActionCard|CharacterCard|ItemCard|LocationCard) = )\{\r?\n/;
  const match = content.match(re);
  if (!match) return null;
  const idx = content.indexOf(match[0]);
  const endIdx = idx + match[0].length;
  const newContent = content.slice(0, endIdx) + insert + content.slice(endIdx);
  return newContent;
}

let added = 0;
let skipped = 0;
let noMatch = 0;
for (const filePath of walkCardFiles(CARDS_ROOT)) {
  const content = readFileSync(filePath, "utf-8");
  const next = addCanonicalId(content, filePath);
  if (next === null) {
    if (/canonicalId\s*:/.test(content)) skipped++;
    else noMatch++;
    continue;
  }
  writeFileSync(filePath, next);
  added++;
}
console.log(`Added canonicalId: ${added}, skipped (had it): ${skipped}, no match: ${noMatch}`);
