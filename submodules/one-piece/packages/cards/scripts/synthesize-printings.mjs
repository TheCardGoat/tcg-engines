// @ts-check
/**
 * One-shot codemod: synthesize the cross-game identity model onto One Piece
 * card definitions (RFC §10 One Piece steps 1–6 / ADR-9 / ADR-11).
 *
 * For every card module under `src/cards/**` it inserts, right after the
 * authored `id:` field, the four identity fields the card now requires because
 * `BaseCardProperties extends BaseCardDefinition`:
 *
 *   - `canonicalId` — seeded from `id` (ADR-9) until reprint data lands.
 *   - `slug`        — lowercased `id` (language-stable URL key).
 *   - `name`        — display name sourced from `i18n.en.name`.
 *   - `printings`   — at least one entry synthesized from `id`/`setId`/`rarity`/
 *                     the base `i18n.en.imageUrl`; each existing `artVariants[]`
 *                     entry that carries an `imageUrl` becomes an ADDITIONAL
 *                     printing whose `artId` is its stabilized `imageId`.
 *
 * The existing `artVariants[]` is preserved verbatim (it stays as a derived
 * back-compat read view). The script is idempotent: files that already expose
 * `printings` are skipped.
 *
 * Run from the `@tcg/op-cards` package root:
 *   node scripts/synthesize-printings.mjs
 *
 * After running, format the tree with `vp fmt`.
 */
import { readFileSync, writeFileSync, globSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = join(__dirname, "..", "src", "cards");

/** @typedef {{ type: string; imageUrl?: string; imageId?: string }} RawArtVariant */
/** @typedef {{ id: string; artId: string; setCode: string; collectorNumber: string; rarity: string; imageUrl: string }} Printing */

const CARD_FILES = globSync("**/*.ts", { cwd: CARDS_DIR }).filter(
  (rel) => !rel.endsWith(".i18n.ts") && basename(rel) !== "index.ts",
);

/**
 * Match the authored `id: "..."` line and capture its indentation so the new
 * fields line up with the surrounding object literal.
 *
 * @param {string} text
 * @returns {{ indent: string; id: string } | null}
 */
function readIdLine(text) {
  const match = text.match(/^([ \t]*)id:\s*"([^"]+)",[ \t]*\r?\n/m);
  return match ? { indent: match[1], id: match[2] } : null;
}

/** @param {string} text @param {string} field @returns {string | null} */
function readStringField(text, field) {
  const re = new RegExp(`^\\s*${field}:\\s*(?:"([^"]*)"|'([^']*)')[ \\t]*,?[ \\t]*$`, "m");
  const match = text.match(re);
  if (!match) return null;
  return match[1] ?? match[2] ?? null;
}

/**
 * Parse the `artVariants: [ ... ]` block into raw variant objects.
 * Entries are flat objects with only string fields, so a brace-balanced scan
 * is safe.
 *
 * @param {string} text
 * @returns {RawArtVariant[]}
 */
function readArtVariants(text) {
  const block = text.match(/artVariants:\s*\[([\s\S]*?)\n([ \t]*)\],/);
  if (!block) return [];
  const body = block[1] ?? "";
  /** @type {RawArtVariant[]} */
  const variants = [];
  for (const entry of body.matchAll(/\{([^{}]*)\}/g)) {
    const inner = entry[1] ?? "";
    if (!inner.includes("type:")) continue;
    const type = inner.match(/type:\s*"([^"]+)"/)?.[1] ?? "other";
    const imageUrl = inner.match(/imageUrl:\s*"([^"]+)"/)?.[1];
    const imageId = inner.match(/imageId:\s*"([^"]+)"/)?.[1];
    variants.push({ type, imageUrl, imageId });
  }
  return variants;
}

/**
 * Build the `printings[]` array per RFC §10 One Piece step 2 / ADR-9.
 *
 * @param {{
 *   id: string;
 *   setId: string;
 *   rarity: string;
 *   baseImageUrl: string;
 *   artVariants: RawArtVariant[];
 * }} input
 * @returns {Printing[]}
 */
function buildPrintings({ id, setId, rarity, baseImageUrl, artVariants }) {
  const collectorNumber = id.split("-")[1] ?? id;
  /** @type {Printing[]} */
  const printings = [
    { id, artId: id, setCode: setId, collectorNumber, rarity, imageUrl: baseImageUrl },
  ];

  for (const variant of artVariants) {
    // Only variants with an image become printings (RFC §10 OP step 2).
    if (!variant.imageUrl) continue;
    // `artId` reuses the (stabilized) `imageId`; fall back to the printing's own
    // id when the upstream scraper did not record one (RFC §4 OP / ADR-7).
    const printingId = variant.imageId ?? variant.imageUrl;
    // Skip a variant that resolves back to the base printing (defensive dedupe).
    if (printingId === id) continue;
    printings.push({
      id: printingId,
      artId: variant.imageId ?? printingId,
      setCode: setId,
      collectorNumber,
      rarity,
      imageUrl: variant.imageUrl,
    });
  }

  // Dedupe by printing id, preserving first-seen order.
  /** @type {Printing[]} */
  const unique = [];
  const seen = new Set();
  for (const printing of printings) {
    if (seen.has(printing.id)) continue;
    seen.add(printing.id);
    unique.push(printing);
  }
  return unique;
}

/** @param {Printing[]} printings @returns {string} */
function renderPrintings(printings) {
  const lines = ["  printings: ["];
  for (const p of printings) {
    lines.push(
      "    { " +
        `id: ${JSON.stringify(p.id)}, ` +
        `artId: ${JSON.stringify(p.artId)}, ` +
        `setCode: ${JSON.stringify(p.setCode)}, ` +
        `collectorNumber: ${JSON.stringify(p.collectorNumber)}, ` +
        `rarity: ${JSON.stringify(p.rarity)}, ` +
        `imageUrl: ${JSON.stringify(p.imageUrl)}` +
        " },",
    );
  }
  lines.push("  ],");
  return lines.join("\n");
}

let processed = 0;
let skipped = 0;
let totalPrintings = 0;
/** @type {Record<number, number>} */
const distribution = {};
const failures = [];

for (const rel of CARD_FILES) {
  const cardPath = join(CARDS_DIR, rel);
  const text = readFileSync(cardPath, "utf8");

  if (/^([ \t]*)printings:/m.test(text)) {
    skipped += 1;
    continue;
  }

  const idLine = readIdLine(text);
  if (!idLine) {
    failures.push(`${rel}: could not locate authored id line`);
    continue;
  }
  const { indent, id } = idLine;

  const setId = readStringField(text, "setId");
  const rarity = readStringField(text, "rarity");
  if (!setId || !rarity) {
    failures.push(`${rel}: missing setId or rarity`);
    continue;
  }

  // Read display name + base image URL from the sibling i18n module.
  const i18nPath = cardPath.replace(/\.ts$/, ".i18n.ts");
  let i18nText = "";
  try {
    i18nText = readFileSync(i18nPath, "utf8");
  } catch {
    failures.push(`${rel}: sibling i18n module not found`);
    continue;
  }
  const name = readStringField(i18nText, "name");
  const baseImageUrl = readStringField(i18nText, "imageUrl");
  if (!name || !baseImageUrl) {
    failures.push(`${rel}: i18n missing name or imageUrl`);
    continue;
  }

  const artVariants = readArtVariants(text);
  const printings = buildPrintings({ id, setId, rarity, baseImageUrl, artVariants });

  const canonicalId = id;
  const slug = id.toLowerCase();

  const insertion = [
    `${indent}canonicalId: ${JSON.stringify(canonicalId)},`,
    `${indent}slug: ${JSON.stringify(slug)},`,
    `${indent}name: ${JSON.stringify(name)},`,
    renderPrintings(printings),
  ].join("\n");

  // Insert immediately after the authored `id:` line.
  const idLineRegex = new RegExp(
    `^(${indent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})id:\\s*"[^"]+",[ \\t]*\\r?\\n`,
    "m",
  );
  if (!idLineRegex.test(text)) {
    failures.push(`${rel}: id-line re-match failed`);
    continue;
  }
  const next = text.replace(idLineRegex, (match) => `${match}${insertion}\n`);

  writeFileSync(cardPath, next);
  processed += 1;
  totalPrintings += printings.length;
  distribution[printings.length] = (distribution[printings.length] ?? 0) + 1;
}

const avg = processed > 0 ? (totalPrintings / processed).toFixed(3) : "0";
console.log(`Codemod complete.`);
console.log(`  processed: ${processed}`);
console.log(`  skipped (already had printings): ${skipped}`);
console.log(`  total printings emitted: ${totalPrintings}`);
console.log(`  average printings/card: ${avg}`);
console.log(`  printings-count distribution:`);
for (const key of Object.keys(distribution)
  .map(Number)
  .sort((a, b) => a - b)) {
  console.log(`    ${key} printing(s): ${distribution[key]} card(s)`);
}
if (failures.length > 0) {
  console.error(`\nFAILURES (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
