import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { CardType, PromoCardDefinition } from "@tcg/cyberpunk-types";
import { loadGeneratedCards } from "./load-generated.ts";
import { parsePromoCards } from "./parser.ts";

type StructuredSetCardDefinition = PromoCardDefinition;

type StructuredSetCode = StructuredSetCardDefinition["set"]["code"];

interface SetConfig {
  code: StructuredSetCode;
  prefix: "promo";
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
  promoCards: PromoCardDefinition[];
}

const SET_CONFIGS: readonly SetConfig[] = [{ code: "promo", prefix: "promo" }] as const;

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
    `import { CyberpunkTestEngine } from "../../../testing/index.ts";`,
    `import { ${name} } from "@tcg/cyberpunk-cards";`,
    ``,
    `describe("${card.displayName}", () => {`,
    itBlocks.join("\n\n"),
    `});`,
    ``,
  ].join("\n");
}

async function writeBucket(rootDir: string, bucket: CardBucket): Promise<void> {
  const bucketDir = join(rootDir, bucket.dir);
  await rm(bucketDir, { recursive: true, force: true });
  await mkdir(bucketDir, { recursive: true });

  for (const card of bucket.cards) {
    await writeFile(join(bucketDir, `${card.slug}.test.ts`), renderEngineTestFile(card));
  }
}

async function writeTypeFiles(
  rootDir: string,
  cards: StructuredSetCardDefinition[],
): Promise<void> {
  const withAbilities = cards.filter((card) => card.abilities.length > 0);
  const buckets = buildBuckets(withAbilities);

  // The parent is generator-owned. Write every bucket so a card removed from
  // the promo source cannot leave a stale generated test behind.
  for (const bucket of buckets) {
    await writeBucket(rootDir, bucket);
  }
}

export async function generateEngineTestFiles(
  options: GenerateEngineTestFilesOptions,
): Promise<GenerateEngineTestFilesResult> {
  const generatedCards = await loadGeneratedCards(options.generatedFilePath);
  const parsed = parsePromoCards(generatedCards);
  if (parsed.unparsedSegments.length > 0) {
    const details = parsed.unparsedSegments
      .map((segment) => `${segment.text}: ${segment.reason}`)
      .join("\n");
    throw new Error(`Cannot generate engine tests from partially parsed cards:\n${details}`);
  }
  const promoCards = parsed.definition;

  await rm(options.outputDir, { recursive: true, force: true });

  await writeTypeFiles(options.outputDir, promoCards);

  return {
    promoCards: promoCards.filter((c) => c.abilities.length > 0),
  };
}
