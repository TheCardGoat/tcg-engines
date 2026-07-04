#!/usr/bin/env bun
/**
 * One-shot codemod for the cross-game card identity model (RFC P1.Lorcana).
 *
 * Run once after the `BaseCardProperties extends BaseCardDefinition` type change.
 * It is idempotent (re-running is a no-op) and performs four transforms:
 *
 *  1. AUX: adds `artId` to every entry in `cards.aux.printing-metadata.json`
 *     (RFC §10 Lorcana step 3). Alt-art tiers (`specialRarity`
 *     enchanted/epic/iconic/promo/challenge) map to `${canonicalId}-${specialRarity}`;
 *     base-rarity printings are degenerate (`artId === id`).
 *  2. SLUG: adds `slug: "lorcana-${canonicalId}"` to base card literals (those with
 *     an explicit `canonicalId:`). Cards that inherit `canonicalId` via spread
 *     (e.g. enchanted/epic variants) inherit `slug` the same way, so no injection
 *     is needed for them.
 *  3. PRINTINGS: adds a representative `printings: [Printing]` to every card
 *     literal, sourced 1:1 from the aux printing for that shortId. Required because
 *     `BaseCardDefinition.printings` is non-optional (RFC ADR-11). Each Lorcana
 *     shortId maps to exactly one aux printing, so this is the card's own printing;
 *     the canonical multi-printing registry stays in aux.
 *  4. EXTERNAL IDS: stringifies number-valued `externalIds.cultureInvariantId` and
 *     `externalIds.tcgPlayer` (RFC §10 Lorcana step 2; unified dict is all-string).
 *
 * Usage: `bun scripts/apply-card-identity-model.ts`
 */
import fs from "node:fs";
import path from "node:path";

const PACKAGE_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(PACKAGE_ROOT, "src", "data");
const CARDS_DIR = path.join(PACKAGE_ROOT, "src", "cards");
const PRINTING_METADATA_PATH = path.join(DATA_DIR, "cards.aux.printing-metadata.json");
const AUX_KV_PATH = path.join(DATA_DIR, "cards.aux.kv.json");

const ALT_RARITIES = new Set(["enchanted", "epic", "iconic", "promo", "challenge"]);

interface AuxPrinting {
  id: string;
  gameCardId: string;
  set: string;
  cardNumber: number;
  rarity: string;
  specialRarity?: string;
  artId?: string;
  [k: string]: unknown;
}

function deriveArtId(printing: AuxPrinting, canonicalId: string | undefined): string {
  if (
    printing.specialRarity &&
    ALT_RARITIES.has(printing.specialRarity) &&
    canonicalId !== undefined
  ) {
    return `${canonicalId}-${printing.specialRarity}`;
  }
  return printing.id;
}

// Aux field emission order for deterministic output (matches CardPrintingMetadata).
const PRINTING_FIELD_ORDER = [
  "id",
  "gameCardId",
  "set",
  "cardNumber",
  "rarity",
  "specialRarity",
  "artId",
  "promoSheetCode",
  "author",
  "flavorText",
  "setRotationState",
  "sortNumber",
] as const;

// ----------------------------------------------------------------------------
// Load aux data.
// ----------------------------------------------------------------------------
const auxKv = JSON.parse(fs.readFileSync(AUX_KV_PATH, "utf8")) as {
  canonicalIdByShortId: Record<string, string>;
};
const canonicalIdByShortId = auxKv.canonicalIdByShortId;
const printingsById = JSON.parse(fs.readFileSync(PRINTING_METADATA_PATH, "utf8")) as Record<
  string,
  AuxPrinting
>;

// ----------------------------------------------------------------------------
// Step 1: add `artId` to aux printing metadata; build shortId -> printing map.
// ----------------------------------------------------------------------------
const printingByShortId = new Map<string, AuxPrinting>();
let auxMissingCanonicalId = 0;
for (const printing of Object.values(printingsById)) {
  const canonicalId = canonicalIdByShortId[printing.gameCardId];
  if (printing.specialRarity && ALT_RARITIES.has(printing.specialRarity) && !canonicalId) {
    auxMissingCanonicalId++;
  }
  const artId = deriveArtId(printing, canonicalId);
  printing.artId = artId;
  printingByShortId.set(printing.gameCardId, printing);
}

// Rebuild each aux entry with `artId` positioned after `specialRarity` for
// deterministic, interface-aligned output (preserves any unknown future fields).
for (const [printingId, printing] of Object.entries(printingsById)) {
  const rebuilt: Record<string, unknown> = {};
  for (const field of PRINTING_FIELD_ORDER) {
    if (field === "artId") {
      rebuilt.artId = printing.artId;
    } else if (printing[field] !== undefined) {
      rebuilt[field] = printing[field];
    }
  }
  for (const [k, v] of Object.entries(printing)) {
    if (!(k in rebuilt)) {
      rebuilt[k] = v;
    }
  }
  printingsById[printingId] = rebuilt as AuxPrinting;
}
fs.writeFileSync(PRINTING_METADATA_PATH, `${JSON.stringify(printingsById, null, 2)}\n`);

// ----------------------------------------------------------------------------
// Step 2-4: update card literal source files.
// ----------------------------------------------------------------------------
function* walkTs(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkTs(full);
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".i18n.ts") &&
      !entry.name.endsWith(".test.ts") &&
      entry.name !== "index.ts"
    ) {
      yield full;
    }
  }
}

const CARD_LITERAL_RE = /export const \w+:\s*(CharacterCard|ActionCard|ItemCard|LocationCard)\s*=/;
const TOP_ID_RE = /^  id: "([^"]+)",?\s*$/;
const TOP_CANONICAL_RE = /^  canonicalId: "([^"]+)",?\s*$/;
const TOP_SLUG_RE = /^  slug:/m;
const TOP_PRINTINGS_RE = /^  printings:/m;
const EXT_NUMBER_RE = /(cultureInvariantId|tcgPlayer):(\s*)(\d+)(\s*,?\s*)/g;

let filesScanned = 0;
let filesChanged = 0;
let slugAdded = 0;
let printingsAdded = 0;
let externalIdsStringified = 0;
const skippedNoPrinting: string[] = [];

for (const file of walkTs(CARDS_DIR)) {
  const original = fs.readFileSync(file, "utf8");
  if (!CARD_LITERAL_RE.test(original)) {
    continue;
  }
  filesScanned++;

  let text = original;

  // Step 4: stringify number-valued externalIds.
  text = text.replace(EXT_NUMBER_RE, (_m, key: string, sp1: string, num: string, sp2: string) => {
    externalIdsStringified++;
    return `${key}:${sp1}"${num}"${sp2}`;
  });

  const lines = text.split("\n");

  // Step 2: inject slug after the explicit canonicalId line (base cards only).
  if (TOP_SLUG_RE.test(text) === false) {
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i]!.match(TOP_CANONICAL_RE);
      if (match) {
        const canonicalId = match[1]!;
        lines.splice(i + 1, 0, `  slug: "lorcana-${canonicalId}",`);
        slugAdded++;
        break;
      }
    }
  }

  // Step 3: inject printings after the top-level id line.
  if (TOP_PRINTINGS_RE.test(text) === false) {
    const idLineIndex = lines.findIndex((l) => TOP_ID_RE.test(l));
    const idMatch = idLineIndex >= 0 ? lines[idLineIndex]!.match(TOP_ID_RE) : null;
    const shortId = idMatch?.[1];
    const printing = shortId ? printingByShortId.get(shortId) : undefined;
    if (printing) {
      const printingLine = `  printings: [{ id: ${JSON.stringify(printing.id)}, artId: ${JSON.stringify(printing.artId)}, setCode: ${JSON.stringify(printing.set)}, collectorNumber: ${JSON.stringify(String(printing.cardNumber))}, rarity: ${JSON.stringify(printing.rarity ?? "")}, imageUrl: "" }],`;
      lines.splice(idLineIndex! + 1, 0, printingLine);
      printingsAdded++;
    } else if (shortId) {
      skippedNoPrinting.push(`${file} (${shortId})`);
    }
  }

  const updated = lines.join("\n");
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    filesChanged++;
  }
}

console.log("=== apply-card-identity-model ===");
console.log(`aux: artId added to ${Object.keys(printingsById).length} printings`);
if (auxMissingCanonicalId > 0) {
  console.log(`aux: WARNING ${auxMissingCanonicalId} alt-art printings lacked canonicalId`);
}
console.log(`cards scanned: ${filesScanned}`);
console.log(`files changed: ${filesChanged}`);
console.log(`slug injected: ${slugAdded}`);
console.log(`printings injected: ${printingsAdded}`);
console.log(`externalIds numbers stringified: ${externalIdsStringified}`);
if (skippedNoPrinting.length > 0) {
  console.log(`WARNING: ${skippedNoPrinting.length} cards had no aux printing:`);
  for (const s of skippedNoPrinting.slice(0, 20)) console.log(`  ${s}`);
}
console.log("done.");
