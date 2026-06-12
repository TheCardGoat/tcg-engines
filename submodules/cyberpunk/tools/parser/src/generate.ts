import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  AlphaCardDefinition,
  BoxToppersRetailCardDefinition,
  CardType,
  PromoCardDefinition,
  SpoilerCardDefinition,
  StructuredCardDefinition,
  TheHeistRetailStarterDeckCardDefinition,
  WelcomeToNightCityRetailCardDefinition,
} from "@tcg/cyberpunk-types";
import { loadGeneratedCards } from "./load-generated.ts";
import {
  parseAlphaCards,
  parseBoxToppersRetailCards,
  parsePromoCards,
  parseSpoilerCards,
  parseTheHeistRetailStarterDeckCards,
  parseWelcomeToNightCityRetailCards,
} from "./parser.ts";

type StructuredSetCardDefinition =
  | AlphaCardDefinition
  | BoxToppersRetailCardDefinition
  | SpoilerCardDefinition
  | PromoCardDefinition
  | TheHeistRetailStarterDeckCardDefinition
  | WelcomeToNightCityRetailCardDefinition
  | StructuredCardDefinition;

type StructuredSetCode = StructuredSetCardDefinition["set"]["code"];

interface SetConfig {
  code: StructuredSetCode;
  typeName:
    | "AlphaCardDefinition"
    | "BoxToppersRetailCardDefinition"
    | "SpoilerCardDefinition"
    | "PromoCardDefinition"
    | "TheHeistRetailStarterDeckCardDefinition"
    | "WelcomeToNightCityRetailCardDefinition"
    | "StructuredCardDefinition";
  prefix: string;
  cardsExportName: string;
  getBySlugName: string;
}

interface BucketMeta {
  dir: "legends" | "units" | "gear" | "programs";
  suffix: "Legends" | "Units" | "Gear" | "Programs";
}

interface CardBucket {
  dir: BucketMeta["dir"];
  exportName: string;
  cards: StructuredSetCardDefinition[];
}

export interface GenerateStructuredCardFilesOptions {
  generatedFilePath: string;
  outputDir: string;
}

export interface GenerateStructuredCardFilesResult {
  alphaCards: AlphaCardDefinition[];
  spoilerCards: SpoilerCardDefinition[];
  promoCards: PromoCardDefinition[];
  boxToppersRetailCards: BoxToppersRetailCardDefinition[];
  theHeistRetailStarterDeckCards: TheHeistRetailStarterDeckCardDefinition[];
  welcomeToNightCityRetailCards: WelcomeToNightCityRetailCardDefinition[];
  retailCards: StructuredCardDefinition[];
}

interface ExistingCardIdentity {
  id: string;
  slug: string | null;
  displayName: string | null;
  name: string | null;
  type: CardType | null;
  setCode: StructuredSetCode | null;
}

interface ExistingCardFile {
  identity: ExistingCardIdentity;
  source: string;
}

const SET_CONFIGS: readonly SetConfig[] = [
  {
    code: "alpha",
    typeName: "AlphaCardDefinition",
    prefix: "alpha",
    cardsExportName: "alphaCards",
    getBySlugName: "getAlphaCardBySlug",
  },
  {
    code: "spoiler",
    typeName: "SpoilerCardDefinition",
    prefix: "spoiler",
    cardsExportName: "spoilerCards",
    getBySlugName: "getSpoilerCardBySlug",
  },
  {
    code: "promo",
    typeName: "PromoCardDefinition",
    prefix: "promo",
    cardsExportName: "promoCards",
    getBySlugName: "getPromoCardBySlug",
  },
  {
    code: "boxtoppersretail",
    typeName: "BoxToppersRetailCardDefinition",
    prefix: "boxTopperRetail",
    cardsExportName: "boxToppersRetailCards",
    getBySlugName: "getBoxToppersRetailCardBySlug",
  },
  {
    code: "theheistretailstarterdeck",
    typeName: "TheHeistRetailStarterDeckCardDefinition",
    prefix: "theHeistRetailStarterDeck",
    cardsExportName: "theHeistRetailStarterDeckCards",
    getBySlugName: "getTheHeistRetailStarterDeckCardBySlug",
  },
  {
    code: "welcometonightcityretail",
    typeName: "WelcomeToNightCityRetailCardDefinition",
    prefix: "welcomeToNightCityRetail",
    cardsExportName: "welcomeToNightCityRetailCards",
    getBySlugName: "getWelcomeToNightCityRetailCardBySlug",
  },
] as const;

const BUCKET_META_BY_TYPE: Record<CardType, BucketMeta> = {
  legend: { dir: "legends", suffix: "Legends" },
  unit: { dir: "units", suffix: "Units" },
  gear: { dir: "gear", suffix: "Gear" },
  program: { dir: "programs", suffix: "Programs" },
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

function bucketForCardType(type: CardType): BucketMeta {
  return BUCKET_META_BY_TYPE[type];
}

function constName(card: StructuredSetCardDefinition): string {
  return `${setConfigForCard(card).prefix}${slugToPascalCase(card.slug)}`;
}

function toTs(value: unknown): string {
  return JSON.stringify(value, null, 2).replace(/"([A-Za-z0-9_]+)":/g, "$1:");
}

function renderCardFile(card: StructuredSetCardDefinition): string {
  const { typeName } = setConfigForCard(card);

  return [
    `import type { ${typeName} } from "@tcg/cyberpunk-types";`,
    "",
    `export const ${constName(card)} = ${toTs(card)} satisfies ${typeName};`,
    "",
  ].join("\n");
}

function renderMergedCardFile(card: StructuredSetCardDefinition, existingSource: string): string {
  let source = existingSource.replace(
    /export const [A-Za-z0-9_]+ =/,
    `export const ${constName(card)} =`,
  );

  source = replaceObjectProperty(source, "id", toTs(card.id));
  source = replaceObjectProperty(source, "externalId", toTs(card.externalId));
  source = replaceObjectProperty(source, "slug", toTs(card.slug));
  source = replaceObjectProperty(source, "name", toTs(card.name));
  source = replaceObjectProperty(source, "subname", toTs(card.subname ?? null));
  source = replaceObjectProperty(source, "displayName", toTs(card.displayName));
  source = replaceObjectProperty(source, "printings", toTs(card.printings));
  source = replaceObjectProperty(
    source,
    "selectedPrintingId",
    toTs(card.selectedPrintingId ?? null),
  );
  source = replaceObjectProperty(source, "imageUrl", toTs(card.imageUrl));
  source = replaceObjectProperty(source, "sourceImageUrl", toTs(card.sourceImageUrl));

  return source.endsWith("\n") ? source : `${source}\n`;
}

function replaceObjectProperty(source: string, propertyName: string, value: string): string {
  const propertyStart = source.search(new RegExp(`\\n  ${propertyName}:`));

  if (propertyStart === -1) {
    return source;
  }

  const valueStart = source.indexOf(":", propertyStart) + 1;
  const valueEnd = findTopLevelPropertyEnd(source, valueStart);

  return `${source.slice(0, valueStart)} ${value}${source.slice(valueEnd)}`;
}

function findTopLevelPropertyEnd(source: string, valueStart: number): number {
  let depth = 0;
  let quote: '"' | "'" | "`" | null = null;
  let escaped = false;

  for (let index = valueStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{" || char === "[") {
      depth += 1;
      continue;
    }

    if (char === "}" || char === "]") {
      depth -= 1;
      continue;
    }

    if (char === "," && depth === 0) {
      return index;
    }
  }

  return source.length;
}

function buildBuckets(config: SetConfig, cards: StructuredSetCardDefinition[]): CardBucket[] {
  const seed: Record<BucketMeta["dir"], CardBucket> = {
    legends: {
      dir: "legends",
      exportName: `${config.prefix}Legends`,
      cards: [],
    },
    units: {
      dir: "units",
      exportName: `${config.prefix}Units`,
      cards: [],
    },
    gear: {
      dir: "gear",
      exportName: `${config.prefix}Gear`,
      cards: [],
    },
    programs: {
      dir: "programs",
      exportName: `${config.prefix}Programs`,
      cards: [],
    },
  };

  for (const card of cards) {
    seed[bucketForCardType(card.type).dir]!.cards.push(card);
  }

  return [seed.legends, seed.units, seed.gear, seed.programs];
}

async function writeBucket(
  outputDir: string,
  typeName: SetConfig["typeName"],
  bucket: CardBucket,
  existingFiles: ReadonlyMap<string, ExistingCardFile>,
): Promise<void> {
  const bucketDir = join(outputDir, bucket.dir);
  await mkdir(bucketDir, { recursive: true });

  const importLines = bucket.cards.map((card) => {
    return `import { ${constName(card)} } from "./${card.slug}.ts";`;
  });
  const exportLines = bucket.cards.map((card) => {
    return `export { ${constName(card)} } from "./${card.slug}.ts";`;
  });
  const arrayItems = bucket.cards.map((card) => `  ${constName(card)},`);

  for (const card of bucket.cards) {
    const existingFile = findExistingCardFile(card, existingFiles);
    const source = existingFile
      ? renderMergedCardFile(card, existingFile.source)
      : renderCardFile(card);
    await writeFile(join(bucketDir, `${card.slug}.ts`), source);
  }

  const indexLines = [
    `import type { ${typeName} } from "@tcg/cyberpunk-types";`,
    ...importLines,
    "",
    ...exportLines,
    "",
    `export const ${bucket.exportName} = [`,
    ...arrayItems,
    `] satisfies ${typeName}[];`,
    "",
  ];

  await writeFile(join(bucketDir, "index.ts"), indexLines.join("\n"));
}

function buildRootIndex(config: SetConfig, buckets: CardBucket[]): string {
  const imports = buckets.map((bucket) => {
    return `import { ${bucket.exportName} } from "./${bucket.dir}/index.ts";`;
  });
  const exports = buckets.map((bucket) => {
    return `export * from "./${bucket.dir}/index.ts";`;
  });

  return [
    `import type { ${config.typeName} } from "@tcg/cyberpunk-types";`,
    ...imports,
    "",
    ...exports,
    "",
    `export const ${config.cardsExportName} = [`,
    ...buckets.map((bucket) => `  ...${bucket.exportName},`),
    `] satisfies ${config.typeName}[];`,
    "",
    `export function ${config.getBySlugName}(slug: string): ${config.typeName} | undefined {`,
    `  return ${config.cardsExportName}.find((card) => card.slug === slug);`,
    "}",
    "",
  ].join("\n");
}

async function writeSetFiles(
  outputDir: string,
  config: SetConfig,
  cards: StructuredSetCardDefinition[],
  existingFiles: ReadonlyMap<string, ExistingCardFile>,
): Promise<void> {
  const setDir = join(outputDir, config.code);
  const buckets = buildBuckets(config, cards);

  await rm(setDir, { recursive: true, force: true });
  await mkdir(setDir, { recursive: true });

  for (const bucket of buckets) {
    await writeBucket(setDir, config.typeName, bucket, existingFiles);
  }

  await writeFile(join(setDir, "index.ts"), buildRootIndex(config, buckets));
}

async function readExistingCardFiles(outputDir: string): Promise<Map<string, ExistingCardFile>> {
  const filesByIdentity = new Map<string, ExistingCardFile>();

  for (const config of SET_CONFIGS) {
    const setDir = join(outputDir, config.code);
    const files = await readCardFiles(setDir);

    for (const file of files) {
      const source = await readFile(file, "utf8");
      const identity = extractExistingCardIdentity(source);

      if (identity) {
        const file = {
          identity,
          source,
        };

        for (const key of existingIdentityKeys(identity)) {
          if (!filesByIdentity.has(key)) {
            filesByIdentity.set(key, file);
          }
        }
      }
    }
  }

  return filesByIdentity;
}

function buildExistingCardIds(
  existingFiles: ReadonlyMap<string, ExistingCardFile>,
): Map<string, string> {
  const ids = new Map<string, string>();

  for (const [key, file] of existingFiles) {
    if (!ids.has(key)) {
      ids.set(key, file.identity.id);
    }
  }

  return ids;
}

function findExistingCardFile(
  card: StructuredSetCardDefinition,
  existingFiles: ReadonlyMap<string, ExistingCardFile>,
): ExistingCardFile | null {
  for (const key of newIdentityKeys(card)) {
    const file = existingFiles.get(key);

    if (file) {
      return file;
    }
  }

  return null;
}

async function readCardFiles(dir: string): Promise<string[]> {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await readCardFiles(entryPath)));
      continue;
    }

    if (entry.name !== "index.ts" && entry.name.endsWith(".ts")) {
      files.push(entryPath);
    }
  }

  return files;
}

function extractExistingCardIdentity(source: string): ExistingCardIdentity | null {
  const id = readStringProperty(source, "id");

  if (!id) {
    return null;
  }

  return {
    id,
    slug: readStringProperty(source, "slug"),
    displayName: readStringProperty(source, "displayName"),
    name: readStringProperty(source, "name"),
    type: readStringProperty(source, "type") as CardType | null,
    setCode: readSetCode(source),
  };
}

function readStringProperty(source: string, propertyName: string): string | null {
  const pattern = new RegExp(`${propertyName}: "([^"]+)"`);
  const match = pattern.exec(source);

  return match?.[1] ?? null;
}

function readSetCode(source: string): StructuredSetCode | null {
  const match = /set:\s*\{[\s\S]*?code: "([^"]+)"/.exec(source);
  const code = match?.[1];

  return SET_CONFIGS.some((config) => config.code === code) ? (code as StructuredSetCode) : null;
}

function existingIdentityKeys(identity: ExistingCardIdentity): string[] {
  return [
    identity.setCode && identity.slug ? `slug:${identity.setCode}:${identity.slug}` : null,
    identity.setCode && identity.type && identity.name
      ? `name:${identity.setCode}:${identity.type}:${identity.name}`
      : null,
  ].filter((key): key is string => key !== null);
}

function newIdentityKeys(card: StructuredSetCardDefinition): string[] {
  return [`slug:${card.set.code}:${card.slug}`, `name:${card.set.code}:${card.type}:${card.name}`];
}

function preserveExistingIds<T extends StructuredSetCardDefinition>(
  cards: T[],
  existingIds: ReadonlyMap<string, string>,
): T[] {
  return cards.map((card) => {
    for (const key of newIdentityKeys(card)) {
      const existingId = existingIds.get(key);

      if (existingId) {
        return {
          ...card,
          id: existingId,
        };
      }
    }

    return card;
  });
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

export async function generateStructuredCardFiles(
  options: GenerateStructuredCardFilesOptions,
): Promise<GenerateStructuredCardFilesResult> {
  const existingFiles = await readExistingCardFiles(options.outputDir);
  const existingIds = buildExistingCardIds(existingFiles);
  const generatedCards = await loadGeneratedCards(options.generatedFilePath);
  const alphaCards = preserveExistingIds(parseAlphaCards(generatedCards), existingIds);
  const spoilerCards = preserveExistingIds(parseSpoilerCards(generatedCards), existingIds);
  const promoCards = preserveExistingIds(parsePromoCards(generatedCards), existingIds);
  const boxToppersRetailCards = preserveExistingIds(
    parseBoxToppersRetailCards(generatedCards),
    existingIds,
  );
  const theHeistRetailStarterDeckCards = preserveExistingIds(
    parseTheHeistRetailStarterDeckCards(generatedCards),
    existingIds,
  );
  const welcomeToNightCityRetailCards = preserveExistingIds(
    parseWelcomeToNightCityRetailCards(generatedCards),
    existingIds,
  );
  const retailCards = [
    ...boxToppersRetailCards,
    ...theHeistRetailStarterDeckCards,
    ...welcomeToNightCityRetailCards,
  ] satisfies StructuredCardDefinition[];

  await writeSetFiles(options.outputDir, SET_CONFIGS[0], alphaCards, existingFiles);
  await writeSetFiles(options.outputDir, SET_CONFIGS[1], spoilerCards, existingFiles);
  await writeSetFiles(options.outputDir, SET_CONFIGS[2], promoCards, existingFiles);
  await writeSetFiles(options.outputDir, SET_CONFIGS[3], boxToppersRetailCards, existingFiles);
  await writeSetFiles(
    options.outputDir,
    SET_CONFIGS[4],
    theHeistRetailStarterDeckCards,
    existingFiles,
  );
  await writeSetFiles(
    options.outputDir,
    SET_CONFIGS[5],
    welcomeToNightCityRetailCards,
    existingFiles,
  );

  return {
    alphaCards,
    spoilerCards,
    promoCards,
    boxToppersRetailCards,
    theHeistRetailStarterDeckCards,
    welcomeToNightCityRetailCards,
    retailCards,
  };
}
