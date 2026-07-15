import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  AlphaCardDefinition,
  CardType,
  PromoCardDefinition,
  SpoilerCardDefinition,
} from "@tcg/cyberpunk-types";
import { loadGeneratedCards } from "./load-generated.ts";
import { parseAlphaCards, parsePromoCards, parseSpoilerCards } from "./parser.ts";

type StructuredSetCardDefinition =
  | AlphaCardDefinition
  | SpoilerCardDefinition
  | PromoCardDefinition;

type StructuredSetCode = StructuredSetCardDefinition["set"]["code"];

interface SetConfig {
  code: StructuredSetCode;
  prefix: "alpha" | "spoiler" | "promo";
}

interface BucketMeta {
  dir: "legends" | "units" | "gear" | "programs";
}

interface CardBucket {
  dir: BucketMeta["dir"];
  cards: StructuredSetCardDefinition[];
}

export interface GenerateEngineTestFilesOptions {
  generatedFilePath: string;
  outputDir: string;
}

export interface GenerateEngineTestFilesResult {
  alphaCards: AlphaCardDefinition[];
  spoilerCards: SpoilerCardDefinition[];
  promoCards: PromoCardDefinition[];
}

const SET_CONFIGS: readonly SetConfig[] = [
  { code: "alpha", prefix: "alpha" },
  { code: "spoiler", prefix: "spoiler" },
  { code: "promo", prefix: "promo" },
] as const;

const BUCKET_META_BY_TYPE: Record<CardType, BucketMeta> = {
  legend: { dir: "legends" },
  unit: { dir: "units" },
  gear: { dir: "gear" },
  program: { dir: "programs" },
};

function slugToPascalCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join("");
}

function setConfigForCard(card: StructuredSetCardDefinition): SetConfig {
  const config = SET_CONFIGS.find((candidate) => candidate.code === card.set.code);
  if (!config) {
    throw new Error(`Unsupported set code: ${card.set.code}`);
  }
  return config;
}

function bucketDirForType(type: CardType): BucketMeta["dir"] {
  return BUCKET_META_BY_TYPE[type].dir;
}

function constName(card: StructuredSetCardDefinition): string {
  return `${setConfigForCard(card).prefix}${slugToPascalCase(card.slug)}`;
}

function buildBuckets(cards: StructuredSetCardDefinition[]): CardBucket[] {
  const seed: Record<BucketMeta["dir"], CardBucket> = {
    legends: { dir: "legends", cards: [] },
    units: { dir: "units", cards: [] },
    gear: { dir: "gear", cards: [] },
    programs: { dir: "programs", cards: [] },
  };

  for (const card of cards) {
    seed[bucketDirForType(card.type)]!.cards.push(card);
  }

  return [seed.legends, seed.units, seed.gear, seed.programs];
}

function renderEngineTestFile(card: StructuredSetCardDefinition): string {
  const name = constName(card);
  const isLegend = card.type === "legend";

  const fixtureLines = isLegend
    ? [`      legendArea: [${name}],`]
    : [`      hand: [${name}],`, `      eddies: ${name}.cost ?? 0,`];

  const itBlocks = card.abilities.map((ability) => {
    const escapedText = ability.text.replaceAll("\\", "\\\\").replaceAll("`", "\\`");
    return [
      `  it(\`${escapedText}\`, () => {`,
      `    CyberpunkTestEngine.createWithFixture({`,
      ...fixtureLines,
      `    });`,
      `  });`,
    ].join("\n");
  });

  return [
    `import { describe, it } from "vite-plus/test";`,
    `import { CyberpunkTestEngine } from "../../testing/index.ts";`,
    `import { ${name} } from "@tcg/cyberpunk-cards";`,
    ``,
    `describe("${card.displayName}", () => {`,
    itBlocks.join("\n\n"),
    `});`,
    ``,
  ].join("\n");
}

async function writeBucket(outputDir: string, bucket: CardBucket): Promise<void> {
  const bucketDir = join(outputDir, bucket.dir);
  await mkdir(bucketDir, { recursive: true });

  for (const card of bucket.cards) {
    await writeFile(join(bucketDir, `${card.slug}.test.ts`), renderEngineTestFile(card));
  }
}

async function writeSetFiles(
  outputDir: string,
  config: SetConfig,
  cards: StructuredSetCardDefinition[],
): Promise<void> {
  const setDir = join(outputDir, config.code);
  const withAbilities = cards.filter((card) => card.abilities.length > 0);
  const buckets = buildBuckets(withAbilities);

  await rm(setDir, { recursive: true, force: true });
  await mkdir(setDir, { recursive: true });

  for (const bucket of buckets) {
    await writeBucket(setDir, bucket);
  }
}

export async function generateEngineTestFiles(
  options: GenerateEngineTestFilesOptions,
): Promise<GenerateEngineTestFilesResult> {
  const generatedCards = await loadGeneratedCards(options.generatedFilePath);
  const alphaCards = parseAlphaCards(generatedCards);
  const spoilerCards = parseSpoilerCards(generatedCards);
  const promoCards = parsePromoCards(generatedCards);

  await writeSetFiles(options.outputDir, SET_CONFIGS[0], alphaCards);
  await writeSetFiles(options.outputDir, SET_CONFIGS[1], spoilerCards);
  await writeSetFiles(options.outputDir, SET_CONFIGS[2], promoCards);

  return {
    alphaCards: alphaCards.filter((c) => c.abilities.length > 0),
    spoilerCards: spoilerCards.filter((c) => c.abilities.length > 0),
    promoCards: promoCards.filter((c) => c.abilities.length > 0),
  };
}
