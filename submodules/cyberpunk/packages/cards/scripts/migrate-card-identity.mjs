/**
 * One-shot codemod for RFC §10 Cyberpunk migration (P1.Cyberpunk).
 *
 * Strips the slug-derived single-string `externalId` from every Cyberpunk card
 * literal (RFC open Q9 — dropped entirely, no `cdn` key) and backfills the
 * identity-model fields the shared `BaseCardDefinition` / `Printing` contracts
 * now require on the Cyberpunk card type:
 *
 *  - `canonicalId: <slug>` on each card (the merged-slug canonical identity;
 *    the merge layer in `merged.ts` re-derives this authoritatively post-merge).
 *  - `artId: <printing.id>` on each printing (1:1 degenerate; RFC §4/§7).
 *  - `imageUrl: <derived CDN URL>` on each printing (from setCode + collectorNumber,
 *    mirroring `getCyberpunkPrintingImageUrl` in `atelier.ts`).
 *  - `rarity: null` → `rarity: ""` on each printing (the base `Printing.rarity`
 *    is a non-null `string`; empty string = "no rarity", priced as "common").
 *
 * Idempotent: re-running it is a no-op (no `externalId` lines to strip; the
 * added fields are only inserted when absent). Targets `packages/cards/src/`
 * card-literal files plus `generated.ts`. The `rawCards` region of
 * `generated.ts` (snake_case `external_id`, `RawCardPrinting`) is deliberately
 * LEFT ALONE — it mirrors the upstream API and is a distinct type.
 *
 * Run: `bun packages/cards/scripts/migrate-card-identity.mjs`
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CARDS_SRC = new URL("../src/", import.meta.url).pathname;
const IMAGE_BASE = "https://cdn.tcg.online/public/cyberpunk/cards";

/** Mirrors `normalizeCollectorNumberForImagePath` in atelier.ts exactly. */
function normalizeCnForImagePath(collectorNumber) {
  return collectorNumber
    .toLowerCase()
    .replace(/^\u03b1/, "a")
    .replace(/^\u03b2/, "b");
}

/** Mirrors `getCyberpunkPrintingImageUrl` in atelier.ts exactly. */
function deriveImageUrl(setCode, collectorNumber) {
  return `${IMAGE_BASE}/${setCode}/${normalizeCnForImagePath(collectorNumber)}.webp`;
}

/** Match the brace/bracket that closes the one opened at `openIdx`. Respects string literals. */
function findMatching(text, openIdx) {
  const open = text[openIdx];
  const close = open === "{" ? "}" : open === "[" ? "]" : null;
  if (!close) return -1;
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = openIdx; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Parse `key: value,` lines out of a printing object body. */
function parsePrintingFields(body) {
  const fields = {};
  const re = /^([ \t]*)([A-Za-z_][A-Za-z0-9_]*):\s*(.+?),?[ \t]*$/gm;
  let m;
  while ((m = re.exec(body)) !== null) {
    const name = m[2];
    const raw = m[3].trim();
    if (
      name === "id" ||
      name === "collectorNumber" ||
      name === "setCode" ||
      name === "artId" ||
      name === "imageUrl"
    ) {
      const lit = raw.match(/^"([^"]*)"$/);
      fields[name] = lit ? lit[1] : raw;
    } else if (name === "rarity") {
      fields.rarity = raw; // keep raw token (null or "Epic" etc.)
    }
  }
  return fields;
}

function transformPrintingsInRegion(text) {
  let out = "";
  let cursor = 0;
  const key = "printings: [";
  let idx = text.indexOf(key, cursor);
  while (idx !== -1) {
    out += text.slice(cursor, idx);
    const arrOpen = text.indexOf("[", idx);
    const arrClose = findMatching(text, arrOpen);
    if (arrClose === -1) {
      out += text.slice(idx);
      return out;
    }
    const arrInner = text.slice(arrOpen + 1, arrClose);

    // Determine indents from the first child object so we reproduce the
    // file's existing formatting exactly.
    const objectIndent = arrInner.match(/\n([ \t]+)\{/);
    const objIndent = objectIndent ? objectIndent[1] : "    ";
    const firstBrace = arrInner.indexOf("{");
    const fieldIndentMatch = arrInner.slice(firstBrace).match(/\n([ \t]+)\S/);
    const fieldIndent = fieldIndentMatch ? fieldIndentMatch[1] : "      ";

    // Walk each top-level {...} child object, preserving the original
    // inter-object whitespace and commas (kept via slice between objects).
    let inner = "";
    let i = 0;
    while (i < arrInner.length) {
      const bOpen = arrInner.indexOf("{", i);
      if (bOpen === -1) {
        // Trailing whitespace before the closing bracket.
        inner += arrInner.slice(i);
        break;
      }
      // Keep whatever whitespace/comma sits between the previous token and `{`.
      inner += arrInner.slice(i, bOpen);
      const bClose = findMatching(arrInner, bOpen);
      if (bClose === -1) {
        inner += arrInner.slice(bOpen);
        break;
      }
      const body = arrInner.slice(bOpen, bClose + 1);
      const bodyInner = body.slice(1, -1);
      const fields = parsePrintingFields(bodyInner);
      const id = fields.id;
      const cn = fields.collectorNumber;
      const sc = fields.setCode;
      const artId = fields.artId ?? id;
      const imageUrl = fields.imageUrl ?? deriveImageUrl(sc, cn);
      const rarityToken =
        fields.rarity === "null" || fields.rarity === undefined ? '""' : fields.rarity;
      // Rebuild the object with a stable field order (id, artId,
      // collectorNumber, setCode, rarity, imageUrl). No leading separator —
      // the inter-object whitespace/comma above handles it.
      const rebuilt =
        `{` +
        `\n${fieldIndent}id: "${id}",` +
        `\n${fieldIndent}artId: "${artId}",` +
        `\n${fieldIndent}collectorNumber: "${cn}",` +
        `\n${fieldIndent}setCode: "${sc}",` +
        `\n${fieldIndent}rarity: ${rarityToken},` +
        `\n${fieldIndent}imageUrl: "${imageUrl}",` +
        `\n${objIndent}}`;
      inner += rebuilt;
      i = bClose + 1;
    }
    out += `printings: [${inner}]`;
    cursor = arrClose + 1;
    idx = text.indexOf(key, cursor);
  }
  out += text.slice(cursor);
  return out;
}

function transformCardRegion(text) {
  // 1. Strip `externalId: "...",` lines (camelCase card-level field only;
  //    rawCards uses snake_case `external_id` and is not in a card region).
  let out = text.replace(/^[ \t]+externalId:\s*"[^"]*",?[ \t]*\r?\n/gm, "");

  // 2. Insert `canonicalId: <slug>` directly after each card-level `slug:` line.
  //    `slug:` appears only at card level (printings have no slug), so this is
  //    unambiguous. canonicalId == slug per the merge contract.
  out = out.replace(/^([ \t]+)slug:\s*("[^"]+"),[ \t]*\r?\n/gm, (whole, indent, slugLit) => {
    return `${indent}slug: ${slugLit},\n${indent}canonicalId: ${slugLit},\n`;
  });

  // 3. Transform every `printings: [...]` array (add artId, imageUrl; fix rarity).
  out = transformPrintingsInRegion(out);
  return out;
}

function transformGeneratedFile(text) {
  // generated.ts has two regions: `rawCards` (RawCardRecord[], snake_case — leave
  // alone) and `cards` (CardDefinition[], camelCase — transform). Split at the
  // `export const cards = [` marker so the rawCards region is untouched.
  const marker = "export const cards = [";
  const splitIdx = text.indexOf(marker);
  if (splitIdx === -1) return transformCardRegion(text);
  const rawRegion = text.slice(0, splitIdx);
  const cardsRegion = text.slice(splitIdx);
  return rawRegion + transformCardRegion(cardsRegion);
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      yield full;
    }
  }
}

const SET_DIRS = [
  "alpha",
  "spoiler",
  "promo",
  "boxtoppersretail",
  "theheistretailstarterdeck",
  "embracingpowerretailstarterdeck",
  "welcometonightcityretail",
];

let touchedFiles = 0;
let touchedPrintings = 0;

for (const set of SET_DIRS) {
  const dir = join(CARDS_SRC, set);
  for await (const file of walk(dir)) {
    const before = await readFile(file, "utf8");
    const after = transformCardRegion(before);
    if (after !== before) {
      const printingCount = (before.match(/printings:\s*\[/g) || []).length;
      touchedPrintings += printingCount;
      await writeFile(file, after);
      touchedFiles += 1;
    }
  }
}

// generated.ts — split raw/cards regions.
const generatedPath = join(CARDS_SRC, "generated.ts");
const genBefore = await readFile(generatedPath, "utf8");
const genAfter = transformGeneratedFile(genBefore);
if (genAfter !== genBefore) {
  await writeFile(generatedPath, genAfter);
  touchedFiles += 1;
  console.log(`transformed generated.ts`);
}

console.log(`done. ${touchedFiles} files changed.`);
