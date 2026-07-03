import { writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { OptcgApiScraper } from "../src/scrapers/optcg-api.ts";
import { normalize } from "../src/normalizer.ts";
import { buildCardEffects } from "../src/effect-parser/index.ts";
import type { ArtVariant, ArtVariantType, CardEffects, CharacterCard } from "@tcg/op-types";
import type { RawOPCard } from "../src/types/scraper.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = join(__dirname, "../../../packages/op-cards/src/cards");

// --- Variant detection ---

const VARIANT_PATTERNS: [RegExp, ArtVariantType][] = [
  [/\(parallel\)/i, "parallel"],
  [/\(alternate art\)/i, "alternate-art"],
  [/\(alt art\)/i, "alternate-art"],
  [/\(manga rare\)/i, "manga-rare"],
  [/\bspr\b/i, "spr"],
];

function detectVariantType(name: string): ArtVariantType | null {
  for (const [pattern, type] of VARIANT_PATTERNS) {
    if (pattern.test(name)) return type;
  }
  return null;
}

function isVariant(raw: RawOPCard): boolean {
  return detectVariantType(raw.card_name) !== null;
}

// --- Name / identifier helpers ---

function cardNumber(id: string): string {
  return id.split("-")[1] ?? id;
}

/**
 * Strip disambiguation suffixes the API appends to names:
 * "(001)", "(Parallel)", "(Alternate Art)", "(SPR)", etc.
 */
function cleanName(name: string): string {
  return name
    .replace(/\s*\(\d+\)/g, "") // "(001)", "(061)"
    .replace(/\s*\(parallel\)/gi, "")
    .replace(/\s*\(alternate art\)/gi, "")
    .replace(/\s*\(alt art\)/gi, "")
    .replace(/\s*\(manga rare\)/gi, "")
    .replace(/\s*\bspr\b/gi, "") // strips "SPR" from inside "(SPR)", leaving "()"
    .replace(/\s*\(\)/g, "") // clean up any empty parens left over
    .trim();
}

function slugify(name: string): string {
  return cleanName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toConstName(name: string, id: string, setId: string): string {
  // "OP01" → "op01", "EB02" → "eb02"
  const setPrefix = setId.toLowerCase();
  const num = cardNumber(id);
  const camel = cleanName(name)
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase())
    .join("");
  return `${setPrefix}${camel}${num}`;
}

// --- File rendering ---

function renderArtVariant(v: ArtVariant): string {
  const lines = [`    {`, `      type: ${JSON.stringify(v.type)},`];
  if (v.imageUrl !== undefined) lines.push(`      imageUrl: ${JSON.stringify(v.imageUrl)},`);
  if (v.imageId !== undefined) lines.push(`      imageId: ${JSON.stringify(v.imageId)},`);
  lines.push(`    }`);
  return lines.join("\n");
}

function renderI18n(card: CharacterCard, constName: string): string {
  const { name, effect, imageUrl } = card.i18n.en;
  const lines = [
    `import type { OPCardI18n } from "@tcg/op-types";`,
    ``,
    `export const ${constName}I18n: OPCardI18n = {`,
    `  en: {`,
    `    name: ${JSON.stringify(cleanName(name))},`,
  ];
  if (effect !== undefined) lines.push(`    effect: ${JSON.stringify(effect)},`);
  if (imageUrl !== undefined) lines.push(`    imageUrl: ${JSON.stringify(imageUrl)},`);
  lines.push(`  },`, `};`, ``);
  return lines.join("\n");
}

function toTs(obj: unknown): string {
  return JSON.stringify(obj, null, 2).replace(/"(\w+)":/g, "$1:");
}

function renderEffects(effects: CardEffects): string {
  const json = toTs(effects);
  const lines = json.split("\n").map((l) => "  " + l);
  lines[0] = "  effects: {";
  lines[lines.length - 1] = "  },";
  return lines.join("\n");
}

function renderCard(card: CharacterCard, constName: string, slug: string, num: string): string {
  const lines = [
    `import type { CharacterCard } from "@tcg/op-types";`,
    `import { ${constName}I18n } from "./${num}-${slug}.i18n.ts";`,
    ``,
    `export const ${constName}: CharacterCard = {`,
    `  id: ${JSON.stringify(card.id)},`,
    `  cardType: "character",`,
    `  color: ${JSON.stringify(card.color)},`,
    `  rarity: ${JSON.stringify(card.rarity)},`,
    `  setId: ${JSON.stringify(card.setId)},`,
    `  cost: ${card.cost},`,
  ];

  if (card.power !== undefined) lines.push(`  power: ${card.power},`);
  if (card.counter !== undefined) lines.push(`  counter: ${card.counter},`);
  if (card.trigger !== undefined) lines.push(`  trigger: ${JSON.stringify(card.trigger)},`);
  if (card.traits !== undefined && card.traits.length > 0)
    lines.push(`  traits: ${JSON.stringify(card.traits)},`);
  if (card.attribute !== undefined) lines.push(`  attribute: ${JSON.stringify(card.attribute)},`);

  if (card.artVariants !== undefined && card.artVariants.length > 0) {
    lines.push(`  artVariants: [\n${card.artVariants.map(renderArtVariant).join(",\n")},\n  ],`);
  }

  const effectText = card.i18n.en.effect;
  if (effectText !== undefined) lines.push(`  effect: ${JSON.stringify(effectText)},`);
  if (card.effects) {
    lines.push(renderEffects(card.effects));
  }

  lines.push(`  i18n: ${constName}I18n,`, `};`, ``);

  return lines.join("\n");
}

// --- Scraping + grouping ---

const scraper = new OptcgApiScraper();
const sets = await scraper.scrapeSetList();

// setId → Map<cardId, CharacterCard>
const charactersBySet = new Map<string, Map<string, CharacterCard>>();

console.log(`Scraping ${sets.length} sets...\n`);

for (const set of sets) {
  process.stdout.write(`  ${set.id} (${set.name})... `);

  let rawCards: RawOPCard[];
  try {
    rawCards = await scraper.scrapeCards(set.id);
  } catch (err) {
    console.log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    continue;
  }

  // Group by card_set_id so we can do a two-pass merge
  const grouped = new Map<string, { bases: RawOPCard[]; variants: RawOPCard[] }>();
  for (const raw of rawCards) {
    const group = grouped.get(raw.card_set_id) ?? { bases: [], variants: [] };
    grouped.set(raw.card_set_id, group);
    if (isVariant(raw)) {
      group.variants.push(raw);
    } else {
      group.bases.push(raw);
    }
  }

  let count = 0;

  for (const [cardId, { bases, variants }] of grouped) {
    // Use the first base card; fall back to first variant if no base exists
    const baseRaw = bases[0] ?? variants[0];
    if (!baseRaw) continue;

    let card: CharacterCard;
    try {
      const normalized = normalize(baseRaw);
      if (normalized.cardType !== "character") continue;
      card = normalized;
    } catch {
      continue;
    }

    // Parse effects from effect text
    const effectText = card.i18n.en.effect;
    if (effectText) {
      const effects = buildCardEffects(effectText);
      if (effects) {
        card.effects = effects;
      }
    }

    // Build artVariants from all non-base raws
    const variantRaws = bases.length > 0 ? [...bases.slice(1), ...variants] : variants.slice(1);
    const artVariants: ArtVariant[] = variantRaws.map((raw) => ({
      type: detectVariantType(raw.card_name) ?? "other",
      imageUrl: raw.card_image ?? undefined,
      imageId: raw.card_image_id ?? undefined,
    }));

    if (artVariants.length > 0) {
      card.artVariants = artVariants;
    }

    const bucket = charactersBySet.get(card.setId) ?? new Map<string, CharacterCard>();
    charactersBySet.set(card.setId, bucket);

    if (!bucket.has(cardId)) {
      bucket.set(cardId, card);
      count++;
    }
  }

  console.log(`${count} unique characters`);
}

// --- Write files ---

let totalFiles = 0;

for (const [setId, characters] of charactersBySet) {
  const setDir = join(CARDS_DIR, setId, "characters");
  mkdirSync(setDir, { recursive: true });

  const exports: string[] = [];

  for (const card of characters.values()) {
    const num = cardNumber(card.id);
    const name = card.i18n.en.name;
    const slug = slugify(name);
    const constName = toConstName(name, card.id, card.setId);

    writeFileSync(join(setDir, `${num}-${slug}.i18n.ts`), renderI18n(card, constName));
    writeFileSync(join(setDir, `${num}-${slug}.ts`), renderCard(card, constName, slug, num));
    exports.push(`export { ${constName} } from "./${num}-${slug}.ts";`);
    totalFiles++;
  }

  writeFileSync(join(setDir, "index.ts"), exports.join("\n") + "\n");
}

// Root cards/index.ts — scan all set dirs and emit exports for each present subdir
const CARD_SUBDIRS = ["leaders", "characters", "events", "stages", "don"];
const allSetIds = existsSync(CARDS_DIR)
  ? readdirSync(CARDS_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
  : [];

const rootLines: string[] = [];
for (const setId of allSetIds) {
  for (const subdir of CARD_SUBDIRS) {
    if (existsSync(join(CARDS_DIR, setId, subdir, "index.ts"))) {
      rootLines.push(`export * from "./${setId}/${subdir}/index.ts";`);
    }
  }
}

mkdirSync(CARDS_DIR, { recursive: true });
writeFileSync(join(CARDS_DIR, "index.ts"), rootLines.join("\n") + "\n");

console.log(`\n✓ ${totalFiles} character files written to packages/op-cards/src/cards/`);

execSync(`vp fmt ${CARDS_DIR}`, { stdio: "inherit", cwd: join(__dirname, "../../..") });
