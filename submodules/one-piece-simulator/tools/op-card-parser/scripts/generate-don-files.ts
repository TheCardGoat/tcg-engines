import { writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { OptcgApiScraper } from "../src/scrapers/optcg-api.ts";
import { normalize } from "../src/normalizer.ts";
import type { ArtVariant, ArtVariantType, DonCard } from "@tcg/op-types";
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

function cleanName(name: string): string {
  return name
    .replace(/\s*\(\d+\)/g, "")
    .replace(/\s*\(parallel\)/gi, "")
    .replace(/\s*\(alternate art\)/gi, "")
    .replace(/\s*\(alt art\)/gi, "")
    .replace(/\s*\(manga rare\)/gi, "")
    .replace(/\s*\bspr\b/gi, "")
    .replace(/\s*\(\)/g, "")
    .trim();
}

function slugify(name: string): string {
  return cleanName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toConstName(name: string, id: string, setId: string): string {
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

function renderI18n(card: DonCard, constName: string): string {
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

function renderCard(card: DonCard, constName: string, slug: string, num: string): string {
  const lines = [
    `import type { DonCard } from "@tcg/op-types";`,
    `import { ${constName}I18n } from "./${num}-${slug}.i18n.ts";`,
    ``,
    `export const ${constName}: DonCard = {`,
    `  id: ${JSON.stringify(card.id)},`,
    `  cardType: "don",`,
    `  color: ${JSON.stringify(card.color)},`,
    `  rarity: ${JSON.stringify(card.rarity)},`,
    `  setId: ${JSON.stringify(card.setId)},`,
  ];

  if (card.artVariants !== undefined && card.artVariants.length > 0) {
    lines.push(`  artVariants: [\n${card.artVariants.map(renderArtVariant).join(",\n")},\n  ],`);
  }

  if (card.effects?.keywords && card.effects.keywords.length > 0) {
    lines.push(`  effects: {`);
    lines.push(`    keywords: ${JSON.stringify(card.effects.keywords)},`);
    lines.push(`  },`);
  }

  lines.push(`  i18n: ${constName}I18n,`, `};`, ``);

  return lines.join("\n");
}

// --- Scraping + grouping ---

const scraper = new OptcgApiScraper();
const sets = await scraper.scrapeSetList();

// setId → Map<cardId, DonCard>
const donBySet = new Map<string, Map<string, DonCard>>();

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
    const baseRaw = bases[0] ?? variants[0];
    if (!baseRaw) continue;

    let card: DonCard;
    try {
      const normalized = normalize(baseRaw);
      if (normalized.cardType !== "don") continue;
      card = normalized;
    } catch {
      continue;
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

    const bucket = donBySet.get(card.setId) ?? new Map<string, DonCard>();
    donBySet.set(card.setId, bucket);

    if (!bucket.has(cardId)) {
      bucket.set(cardId, card);
      count++;
    }
  }

  console.log(`${count} DON!! cards`);
}

// --- Write files ---

let totalFiles = 0;

for (const [setId, dons] of donBySet) {
  const setDir = join(CARDS_DIR, setId, "don");
  mkdirSync(setDir, { recursive: true });

  const exports: string[] = [];

  for (const card of dons.values()) {
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

console.log(`\n✓ ${totalFiles} DON!! files written to packages/op-cards/src/cards/`);
