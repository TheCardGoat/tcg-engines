#!/usr/bin/env bun
/**
 * One-shot codemod (SAFE v2): add `slug` + `printings` ONLY to inline CARD
 * object CONSTRUCTIONS in test files (mock factories / inline literals), left
 * partial by the `BaseCardProperties extends BaseCardDefinition` change.
 *
 * Distinguishes a card construction from a card-shaped ASSERTION by locating
 * the object's opening `{` line: if it sits in a matcher call
 * (`toMatchObject` / `toEqual` / `toContainEqual` / `expect`), the object is an
 * assertion expectation and is left untouched — `toMatchObject` is a partial
 * match that already tolerates the new fields on real cards. Otherwise the
 * object is a construction (`return {`, `= {`, `: CardType`) and is patched.
 *
 * Also requires the object to declare both `canonicalId:` and `cardType:` as
 * same-indent fields, and resolves the nearest `id:` within the same object.
 *
 * Idempotent. Usage: `bun scripts/apply-card-identity-model-tests.ts`
 */
import fs from "node:fs";
import path from "node:path";

const WORKSPACE_ROOT = path.resolve(__dirname, "../../../.."); // submodules/lorcana
const PACKAGES_DIR = path.join(WORKSPACE_ROOT, "packages");

const CANONICAL_RE = /^(\s*)canonicalId\b\s*:\s*(.+?),?\s*$/;
const ID_RE = /^(\s*)id\b(?:\s*:\s*(.+?))?\s*,?\s*$/;
const MATCHER_RE = /\b(toMatchObject|toEqual|toContainEqual|toHaveBeenCalledWith|expect)\b/;

function leadingSpaces(line: string): number {
  return line.match(/^\s*/)![0].length;
}
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function prefixedSlugExpr(canonicalExpr: string): string {
  const trimmed = canonicalExpr.trim().replace(/,?$/, "");
  const strMatch = trimmed.match(/^"([^"]*)"$/);
  if (strMatch) return `"lorcana-${strMatch[1]}"`;
  const tplMatch = trimmed.match(/^`([^`]*)`$/);
  if (tplMatch) return `\`lorcana-${tplMatch[1]}\``;
  return `\`lorcana-\${${trimmed}}\``;
}

/** Find the opening `{` line of the object containing `lineIdx` (brace tracking). */
function findObjectOpener(lines: string[], lineIdx: number, fieldIndent: number): number {
  let depth = 0;
  for (let j = lineIdx; j >= 0; j--) {
    const line = lines[j]!;
    for (let k = line.length - 1; k >= 0; k--) {
      const ch = line[k]!;
      if (ch === "}") depth++;
      else if (ch === "{") {
        if (depth === 0) {
          // This `{` opens the object containing lineIdx. But only treat it as
          // the opener if it is less indented than the field (a sibling/parent
          // object opener) — otherwise keep scanning for the parent opener.
          if (leadingSpaces(line) < fieldIndent) return j;
        }
        depth--;
      }
    }
  }
  return -1;
}

function* walkTs(dir: string): Generator<string> {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      yield* walkTs(full);
    } else if (entry.isFile() && entry.name.endsWith(".test.ts")) {
      yield full;
    }
  }
}

let filesChanged = 0;
let slugInjected = 0;
let printingsInjected = 0;
let skippedAssertions = 0;

for (const file of walkTs(PACKAGES_DIR)) {
  const original = fs.readFileSync(file, "utf8");
  const lines = original.split("\n");

  interface Insertion {
    afterLine: number;
    content: string;
    kind: "slug" | "printings";
  }
  const insertions: Insertion[] = [];

  for (let i = 0; i < lines.length; i++) {
    const cMatch = lines[i]!.match(CANONICAL_RE);
    if (!cMatch) continue;
    const indent = cMatch[1]!;
    const canonicalExpr = cMatch[2]!;
    const indentLen = indent.length;

    // Card object must declare `cardType:` as a same-indent field.
    const cardTypeRe = new RegExp(`^${escapeRegex(indent)}cardType\\b\\s*:`);
    const slugRe = new RegExp(`^${escapeRegex(indent)}slug\\b\\s*:`);
    const printingsRe = new RegExp(`^${escapeRegex(indent)}printings\\b\\s*:`);

    const inObject = (check: (line: string) => boolean): boolean => {
      for (const dir of [-1, 1] as const) {
        let j = i + dir;
        const seen = new Set<number>();
        while (j >= 0 && j < lines.length && seen.size < 60) {
          seen.add(j);
          const line = lines[j]!;
          if (line.trim().length > 0 && leadingSpaces(line) < indentLen) break;
          if (check(line)) return true;
          j += dir;
        }
      }
      return false;
    };

    if (!inObject((line) => cardTypeRe.test(line))) continue;

    // Skip assertion expectations: locate the object opener and bail only if the
    // opener line itself is a matcher call (e.g. `expect(x).toMatchObject({`).
    const opener = findObjectOpener(lines, i, indentLen);
    if (opener >= 0 && MATCHER_RE.test(lines[opener]!)) {
      skippedAssertions++;
      continue;
    }

    // Nearest preceding same-indent `id:` (within object bounds only).
    let idIdx = -1;
    let idExpr: string | undefined;
    for (let j = i - 1; j >= 0; j--) {
      const line = lines[j]!;
      if (line.trim().length > 0 && leadingSpaces(line) < indentLen) break;
      const iMatch = line.match(ID_RE);
      if (iMatch && iMatch[1]!.length === indentLen) {
        idIdx = j;
        idExpr = iMatch[2]?.trim().replace(/,?$/, "") ?? "id";
        break;
      }
    }

    if (!inObject((line) => slugRe.test(line))) {
      insertions.push({
        afterLine: i,
        content: `${indent}slug: ${prefixedSlugExpr(canonicalExpr)},`,
        kind: "slug",
      });
    }
    if (idIdx >= 0 && idExpr && !inObject((line) => printingsRe.test(line))) {
      insertions.push({
        afterLine: idIdx,
        content: `${indent}printings: [{ id: ${idExpr}, artId: ${idExpr}, setCode: "TST", collectorNumber: "1", rarity: "common", imageUrl: "" }],`,
        kind: "printings",
      });
    }
  }

  if (insertions.length === 0) continue;
  insertions.sort((a, b) => b.afterLine - a.afterLine);
  for (const ins of insertions) {
    lines.splice(ins.afterLine + 1, 0, ins.content);
    if (ins.kind === "slug") slugInjected++;
    else printingsInjected++;
  }
  const updated = lines.join("\n");
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    filesChanged++;
  }
}

console.log("=== apply-card-identity-model-tests (safe v2) ===");
console.log(`files changed: ${filesChanged}`);
console.log(`slug injected: ${slugInjected}`);
console.log(`printings injected: ${printingsInjected}`);
console.log(`assertion expectations skipped: ${skippedAssertions}`);
console.log("done.");
