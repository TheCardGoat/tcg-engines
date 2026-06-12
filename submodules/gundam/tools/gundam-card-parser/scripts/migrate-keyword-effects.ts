/**
 * One-shot migration for the "printed keywords wrongly parsed as grantKeyword"
 * fix. Operates *surgically* on card files — it does NOT re-run `parseEffect`
 * over them (which would regress hand-tuned effect blocks where the parser
 * has coverage gaps).
 *
 * For each card file:
 *
 *   1. Finds the top-level `effects: [...]` TypeScript object-literal array.
 *   2. Walks its top-level entries by brace depth and removes any entry that
 *      looks like the spurious printed-keyword artifact: a `type: "constant"`
 *      entry with a single `grantKeyword` step targeting `owner: "self"`
 *      with `duration: "permanent"`, whose `sourceText` parses as a
 *      standalone printed keyword segment.
 *   3. Upgrades any nested TokenSpec `keywordEffects: ["Blocker"]` string
 *      arrays to the new `[{ keyword: "Blocker" }]` object shape.
 *   4. Recomputes the top-level `card.keywordEffects` field by scanning the
 *      raw `effect:` string with the normalizer's `parseKeywordEffects`.
 *
 * Run with:
 *   node --experimental-strip-types tools/gundam-card-parser/scripts/migrate-keyword-effects.ts
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { KeywordEffect, KeywordEffectEntry } from "@tcg/gundam-types";
import { cleanHtml, parseKeywordEffectName } from "./effect-parser/helpers.ts";
import { extractPrintedKeyword, splitIntoSegments } from "./effect-parser/segments.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CARDS_DIR = join(__dirname, "../../../packages/cards/src/cards");

// ── File discovery ─────────────────────────────────────────────────────────────

function findCardFiles(dir: string): string[] {
  const result: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...findCardFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "index.ts") {
      result.push(fullPath);
    }
  }
  return result;
}

// ── Raw-string helpers ─────────────────────────────────────────────────────────

function extractEffectString(src: string): string | null {
  // Match `effect:` followed by either a single string literal or a
  // concatenation of them across multiple lines (which vp fmt produces for
  // long strings). We grab the whole thing up to the trailing comma, strip
  // newlines and concatenation operators, then JSON.parse each string chunk.
  const match = src.match(/^  effect:\s*((?:"(?:[^"\\]|\\.)*"\s*)+),$/m);
  if (!match || !match[1]) return null;
  const chunks = match[1].match(/"(?:[^"\\]|\\.)*"/g);
  if (!chunks) return null;
  try {
    return chunks.map((c) => JSON.parse(c) as string).join("");
  } catch {
    return null;
  }
}

function parseKeywordEffectsFromEffect(effect: string | null): KeywordEffectEntry[] {
  if (!effect) return [];
  const segments = splitIntoSegments(cleanHtml(effect));
  const out: KeywordEffectEntry[] = [];
  const seen = new Set<KeywordEffect>();
  for (const seg of segments) {
    const entry = extractPrintedKeyword(seg);
    if (!entry || seen.has(entry.keyword)) continue;
    seen.add(entry.keyword);
    out.push(entry);
  }
  return out;
}

// ── Brace walking ──────────────────────────────────────────────────────────────

/**
 * Walk brackets/braces in source, respecting strings, to find the matching
 * closing character. Returns the index of the matching closer (inclusive).
 */
function findMatchingClose(src: string, startIdx: number, open: string, close: string): number {
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    if (esc) {
      esc = false;
      continue;
    }
    if (inStr) {
      if (c === "\\") {
        esc = true;
        continue;
      }
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Return the span of the `effects: [ ... ]` array content (the `[` through
 * its matching `]`), or null if not found.
 */
function locateEffectsArray(src: string): { openIdx: number; closeIdx: number } | null {
  const marker = "\n  effects: [";
  const idx = src.indexOf(marker);
  if (idx === -1) return null;
  const openIdx = idx + marker.length - 1; // index of `[`
  const closeIdx = findMatchingClose(src, openIdx, "[", "]");
  if (closeIdx === -1) return null;
  return { openIdx, closeIdx };
}

/**
 * Walk the top-level entries inside the effects array literal. Returns
 * a list of spans `[entryStart, entryEndExclusive]` for each `{...},`
 * top-level entry (including the trailing comma and the newline after it
 * if present).
 */
function locateTopLevelEntries(
  src: string,
  arrOpen: number,
  arrClose: number,
): Array<{ start: number; end: number }> {
  const entries: Array<{ start: number; end: number }> = [];
  let i = arrOpen + 1;
  while (i < arrClose) {
    // Skip whitespace
    while (i < arrClose && /\s/.test(src[i])) i++;
    if (i >= arrClose) break;
    if (src[i] !== "{") {
      i++;
      continue;
    }
    const objClose = findMatchingClose(src, i, "{", "}");
    if (objClose === -1 || objClose > arrClose) break;
    let end = objClose + 1;
    // Consume trailing comma + whitespace up to the next newline
    while (end < arrClose && (src[end] === "," || src[end] === " ")) end++;
    if (end < arrClose && src[end] === "\n") end++;
    entries.push({ start: i, end });
    i = end;
  }
  return entries;
}

// ── Artifact detection ────────────────────────────────────────────────────────

/**
 * True if this entry text represents the spurious printed-keyword artifact.
 * Detection is textual: the entry must contain `type: "constant"`, a
 * `"grantKeyword"` action, `owner: "self"`, `duration: "permanent"`, and a
 * `sourceText` whose contents parse as a standalone printed keyword.
 */
function isPrintedKeywordArtifactText(entryText: string): boolean {
  if (!/type:\s*"constant"/.test(entryText)) return false;
  if (!/action:\s*"grantKeyword"/.test(entryText)) return false;
  if (!/owner:\s*"self"/.test(entryText)) return false;
  if (!/duration:\s*"permanent"/.test(entryText)) return false;

  // Extract sourceText — it may be on the same line or on a following
  // continuation line after `sourceText:` with a string literal (possibly
  // split into multiple concatenated string parts by vp fmt).
  const stM = entryText.match(/sourceText:\s*((?:"(?:[^"\\]|\\.)*"\s*)+)/);
  if (!stM) return false;
  const chunks = stM[1].match(/"(?:[^"\\]|\\.)*"/g);
  if (!chunks) return false;
  let sourceText: string;
  try {
    sourceText = chunks.map((c) => JSON.parse(c) as string).join("");
  } catch {
    return false;
  }
  return extractPrintedKeyword(sourceText.trim()) !== null;
}

// ── Source rewriting ───────────────────────────────────────────────────────────

function removePrintedKeywordArtifacts(src: string): { src: string; removed: number } {
  const loc = locateEffectsArray(src);
  if (!loc) return { src, removed: 0 };

  const entries = locateTopLevelEntries(src, loc.openIdx, loc.closeIdx);
  let newSrc = src;
  let removed = 0;
  // Iterate right-to-left so indices stay stable as we splice.
  for (let i = entries.length - 1; i >= 0; i--) {
    const { start, end } = entries[i];
    const entryText = src.slice(start, end);
    if (isPrintedKeywordArtifactText(entryText)) {
      newSrc = newSrc.slice(0, start) + newSrc.slice(end);
      removed++;
    }
  }

  // If we emptied the effects array completely, leave it as an empty-literal
  // `effects: []` by collapsing the newlines inside it. vp fmt will handle
  // the rest.
  if (removed > 0) {
    newSrc = newSrc.replace(/effects:\s*\[\s*\]/g, "effects: []");
  }

  return { src: newSrc, removed };
}

/**
 * Replace nested TokenSpec `keywordEffects: ["Blocker", "Repair"]` (string-
 * array form) with the new `[{ keyword: "Blocker" }, { keyword: "Repair" }]`
 * object form. Safe because the only place that uses this shape in card
 * files is inside TokenSpec literals.
 */
function upgradeNestedTokenKeywords(src: string): string {
  return src.replace(/keywordEffects:\s*\[\s*((?:"[^"]+"\s*,?\s*)+)\]/g, (match, items: string) => {
    const names = (items.match(/"([^"]+)"/g) ?? []).map((q) => q.slice(1, -1));
    if (names.length === 0) return match;
    const entries = names.map((n) => {
      const mapped = parseKeywordEffectName(n) ?? n;
      return `{ keyword: "${mapped}" }`;
    });
    return `keywordEffects: [${entries.join(", ")}]`;
  });
}

/**
 * Replace the top-level (2-space indent) `keywordEffects: [...]` line with
 * the freshly-computed intrinsic keyword entries.
 */
function replaceTopLevelKeywordEffects(src: string, entries: KeywordEffectEntry[]): string {
  const literal =
    entries.length === 0
      ? "[]"
      : `[${entries
          .map((e) =>
            e.value !== undefined
              ? `{ keyword: "${e.keyword}", value: ${e.value} }`
              : `{ keyword: "${e.keyword}" }`,
          )
          .join(", ")}]`;
  const re = /^ {2}keywordEffects:\s*\[[\s\S]*?\],/m;
  if (!re.test(src)) return src;
  return src.replace(re, `  keywordEffects: ${literal},`);
}

// ── Main loop ──────────────────────────────────────────────────────────────────

const files = findCardFiles(CARDS_DIR);

let updated = 0;
let unchanged = 0;
let artifactsRemoved = 0;

for (const filePath of files) {
  const src = readFileSync(filePath, "utf8");

  const { src: afterRemoval, removed } = removePrintedKeywordArtifacts(src);
  artifactsRemoved += removed;

  const afterTokenUpgrade = upgradeNestedTokenKeywords(afterRemoval);

  const effectStr = extractEffectString(afterTokenUpgrade);
  const entries = parseKeywordEffectsFromEffect(effectStr);
  const afterKeywords = replaceTopLevelKeywordEffects(afterTokenUpgrade, entries);

  if (afterKeywords !== src) {
    writeFileSync(filePath, afterKeywords);
    updated++;
  } else {
    unchanged++;
  }
}

console.log(`\nMigration complete:`);
console.log(`  Files updated:                       ${updated}`);
console.log(`  Files unchanged:                     ${unchanged}`);
console.log(`  Printed-keyword effects removed:     ${artifactsRemoved}`);
