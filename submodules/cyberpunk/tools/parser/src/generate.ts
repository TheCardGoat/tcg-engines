import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  Ability,
  AlphaCardDefinition,
  CardKeyword,
  CardType,
  PromoCardDefinition,
  Prm01CardDefinition,
  BoxToppersRetailCardDefinition,
  SpoilerCardDefinition,
  StructuredCardDefinition,
  TheHeistRetailStarterDeckCardDefinition,
  EmbracingPowerRetailStarterDeckCardDefinition,
  WelcomeToNightCityRetailCardDefinition,
} from "@tcg/cyberpunk-types";
import { loadGeneratedCards } from "./load-generated.ts";
import {
  parseAlphaCards,
  parseBoxToppersRetailCards,
  parseEmbracingPowerRetailStarterDeckCards,
  parsePromoCards,
  parsePrm01Cards,
  parseSpoilerCards,
  parseTheHeistRetailStarterDeckCards,
  parseWelcomeToNightCityRetailCards,
} from "./parser.ts";

type StructuredSetCardDefinition =
  | AlphaCardDefinition
  | SpoilerCardDefinition
  | PromoCardDefinition
  | Prm01CardDefinition
  | BoxToppersRetailCardDefinition
  | TheHeistRetailStarterDeckCardDefinition
  | EmbracingPowerRetailStarterDeckCardDefinition
  | WelcomeToNightCityRetailCardDefinition
  | StructuredCardDefinition;

type StructuredSetCode = StructuredSetCardDefinition["set"]["code"];

interface SetConfig {
  code: StructuredSetCode;
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
  prm01Cards: Prm01CardDefinition[];
  boxToppersRetailCards: BoxToppersRetailCardDefinition[];
  theHeistRetailStarterDeckCards: TheHeistRetailStarterDeckCardDefinition[];
  embracingPowerRetailStarterDeckCards: EmbracingPowerRetailStarterDeckCardDefinition[];
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
    prefix: "alpha",
    cardsExportName: "alphaCards",
    getBySlugName: "getAlphaCardBySlug",
  },
  {
    code: "spoiler",
    prefix: "spoiler",
    cardsExportName: "spoilerCards",
    getBySlugName: "getSpoilerCardBySlug",
  },
  {
    code: "promo",
    prefix: "promo",
    cardsExportName: "promoCards",
    getBySlugName: "getPromoCardBySlug",
  },
  {
    code: "PRM01",
    prefix: "prm01",
    cardsExportName: "prm01Cards",
    getBySlugName: "getPrm01CardBySlug",
  },
  {
    code: "boxtoppersretail",
    prefix: "boxToppersRetail",
    cardsExportName: "boxToppersRetailCards",
    getBySlugName: "getBoxToppersRetailCardBySlug",
  },
  {
    code: "theheistretailstarterdeck",
    prefix: "theHeistRetailStarterDeck",
    cardsExportName: "theHeistRetailStarterDeckCards",
    getBySlugName: "getTheHeistRetailStarterDeckCardBySlug",
  },
  {
    code: "embracingpowerretailstarterdeck",
    prefix: "embracingPowerRetailStarterDeck",
    cardsExportName: "embracingPowerRetailStarterDeckCards",
    getBySlugName: "getEmbracingPowerRetailStarterDeckCardBySlug",
  },
  {
    code: "welcometonightcityretail",
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

const CARD_TYPE_NAME_BY_TYPE: Record<CardType, string> = {
  legend: "LegendCardDefinition",
  unit: "UnitCardDefinition",
  gear: "GearCardDefinition",
  program: "ProgramCardDefinition",
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

const BUCKET_TYPE_NAME_BY_DIR: Record<BucketMeta["dir"], string> = {
  legends: "LegendCardDefinition",
  units: "UnitCardDefinition",
  gear: "GearCardDefinition",
  programs: "ProgramCardDefinition",
};

function constName(card: StructuredSetCardDefinition): string {
  return `${setConfigForCard(card).prefix}${slugToPascalCase(card.slug)}`;
}

function toTs(value: unknown): string {
  return JSON.stringify(value, null, 2).replace(/"([A-Za-z0-9_]+)":/g, "$1:");
}

function compactJsonValue(value: unknown): unknown {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  if (Array.isArray(value)) {
    const compacted = value
      .map(compactJsonValue)
      .filter((entry): entry is NonNullable<unknown> => entry !== undefined);
    return compacted.length > 0 ? compacted : undefined;
  }

  if (typeof value === "object") {
    const compacted: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      const compactedValue = compactJsonValue(nestedValue);
      if (compactedValue !== undefined) {
        compacted[key] = compactedValue;
      }
    }
    return Object.keys(compacted).length > 0 ? compacted : undefined;
  }

  return value;
}

const OMITTED_NULL_GENERATED_PROPERTIES = [
  "subname",
  "rulesText",
  "flavorText",
  "description",
  "youtubeUrl",
  "sourceUrl",
  "selectedPrintingId",
] as const;

const METADATA_BACKED_CARD_PROPERTIES = ["printings", "selectedPrintingId"] as const;

const COMPACT_DEFAULT_CARD_PROPERTIES = [
  "abilities",
  "attachment",
  "classifications",
  "keywords",
  "timingTriggers",
  "reminderText",
] as const;

const CARD_TEXT_PROPERTIES = [
  "name",
  "subname",
  "displayName",
  "rulesText",
  "flavorText",
  "description",
  "youtubeUrl",
  "sourceUrl",
] as const;

function omitMetadataBackedProperties(card: StructuredSetCardDefinition): Record<string, unknown> {
  const generatedCard: Record<string, unknown> = { ...card };

  for (const property of METADATA_BACKED_CARD_PROPERTIES) {
    delete generatedCard[property];
  }

  for (const property of COMPACT_DEFAULT_CARD_PROPERTIES) {
    if (
      generatedCard[property] === null ||
      (Array.isArray(generatedCard[property]) && generatedCard[property].length === 0)
    ) {
      delete generatedCard[property];
    }
  }

  return compactJsonValue(generatedCard) as Record<string, unknown>;
}

function metadataKey(card: StructuredSetCardDefinition): string {
  return `${card.set.code}:${card.slug}`;
}

function metadataForCard(card: StructuredSetCardDefinition): Record<string, unknown> {
  return compactJsonValue({
    i18n: {
      en: {
        name: card.name,
        subname: card.subname,
        displayName: card.displayName,
        rulesText: card.rulesText,
        flavorText: card.flavorText,
        description: card.description,
        youtubeUrl: card.youtubeUrl,
        sourceUrl: card.sourceUrl,
      },
    },
    printings: card.printings,
    selectedPrintingId: card.selectedPrintingId,
  }) as Record<string, unknown>;
}

/**
 * Maps each keyword to its shared factory name in `@tcg/cyberpunk-types`. Kept
 * in sync with `packages/types/src/keyword-abilities.ts`.
 */
const KEYWORD_FACTORY_NAMES: Record<CardKeyword, string> = {
  goSolo: "goSoloAbility",
  blocker: "blockerAbility",
  adrenaline: "adrenalineAbility",
  quick: "quickAbility",
};

/**
 * If `ability` is a `kind: "keyword"` ability backed by a shared factory,
 * return the factory-call source that reproduces it verbatim; otherwise return
 * `null` so the caller falls back to {@link toTs}. The `text` is always passed
 * (preserving the parser-produced reminder copy exactly), and `host: true` is
 * emitted when the ability targets the gear's host.
 */
function renderKeywordAbilityFactoryCall(ability: Ability): string | null {
  if (ability.kind !== "keyword" || ability.keyword === undefined) {
    return null;
  }

  const factory = KEYWORD_FACTORY_NAMES[ability.keyword];
  if (factory === undefined) {
    return null;
  }

  const options: string[] = [`text: ${toTs(ability.text)}`];
  if (ability.source?.selector === "host") {
    options.push("host: true");
  }

  return `${factory}({ ${options.join(", ")} })`;
}

function renderCardFile(card: StructuredSetCardDefinition): string {
  const typeName = CARD_TYPE_NAME_BY_TYPE[card.type];
  const generatedCard = omitMetadataBackedProperties(card);
  const abilities = (generatedCard.abilities ?? []) as Ability[];

  // Map each ability to either a factory-call source (for keyword abilities) or
  // null (fall back to toTs). When at least one factory call is present, render
  // keyword abilities via the shared factories and add the matching runtime
  // import; otherwise emit the whole card as a single literal as before.
  const factoryCalls = abilities.map(renderKeywordAbilityFactoryCall);
  const factoryNames = [
    ...new Set(
      factoryCalls
        .filter((call): call is string => call !== null)
        .map((call) => call.split("(")[0]!),
    ),
  ].sort();

  const importLines = [
    `import type { ${typeName} } from "@tcg/cyberpunk-types";`,
    `import { defineCyberpunkCard } from "../../define.ts";`,
  ];
  if (factoryNames.length > 0) {
    importLines.push(`import { ${factoryNames.join(", ")} } from "@tcg/cyberpunk-types";`);
  }

  let body: string;
  if (factoryNames.length === 0) {
    body = toTs(generatedCard);
  } else {
    // Swap each keyword ability for a unique sentinel string token so the
    // surrounding JSON stays valid, then splice each token back to its factory
    // call. The tokens are used only as string values, so toTs keeps them
    // quoted and the quoted forms are replaced verbatim.
    const cardWithTokens: Record<string, unknown> = { ...generatedCard };
    cardWithTokens.abilities = abilities.map((ability, index) => {
      if (factoryCalls[index] === null) {
        return ability;
      }
      return `__keyword_factory_${index}__`;
    });

    body = toTs(cardWithTokens);
    for (const [index, call] of factoryCalls.entries()) {
      if (call === null) {
        continue;
      }
      const token = `"__keyword_factory_${index}__"`;
      // Use a replacer function so `$` in the factory call text is emitted
      // literally instead of being interpreted by String.replace.
      body = body.replace(token, () => call);
    }
  }

  return [
    ...importLines,
    "",
    `export const ${constName(card)} = defineCyberpunkCard(${body}) satisfies ${typeName};`,
    "",
  ].join("\n");
}

function renderMergedCardFile(card: StructuredSetCardDefinition, existingSource: string): string {
  const typeName = CARD_TYPE_NAME_BY_TYPE[card.type];
  let source = existingSource.replace(
    /export const [A-Za-z0-9_]+ =/,
    `export const ${constName(card)} =`,
  );

  source = source.replace(
    /import type \{ [A-Za-z0-9_]+ \} from "@tcg\/cyberpunk-types";\n/,
    `import type { ${typeName} } from "@tcg/cyberpunk-types";\n`,
  );
  source = source.replace(/\} satisfies [A-Za-z0-9_]+;/, `} satisfies ${typeName};`);

  source = replaceObjectProperty(source, "id", toTs(card.id));
  source = replaceObjectProperty(source, "slug", toTs(card.slug));
  source = replaceObjectProperty(source, "imageUrl", toTs(card.imageUrl));
  for (const property of CARD_TEXT_PROPERTIES) {
    source = upsertCardTextProperty(source, property, card[property]);
  }
  source = removeObjectProperty(source, "sourceImageUrl");
  for (const property of METADATA_BACKED_CARD_PROPERTIES) {
    source = removeTopLevelObjectProperty(source, property);
  }
  for (const property of COMPACT_DEFAULT_CARD_PROPERTIES) {
    source = removeEmptyTopLevelObjectProperty(source, property);
  }
  source = removePrintedNullProperties(source);
  source = source.replace(/,,/g, ",");
  source = wrapWithDefineCyberpunkCard(source);

  return source.endsWith("\n") ? source : `${source}\n`;
}

function upsertCardTextProperty(
  source: string,
  propertyName: (typeof CARD_TEXT_PROPERTIES)[number],
  value: string | null | undefined,
): string {
  if (value === null || value === undefined) {
    return removeTopLevelObjectProperty(source, propertyName);
  }

  return upsertTopLevelObjectProperty(source, propertyName, toTs(value));
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

function upsertTopLevelObjectProperty(source: string, propertyName: string, value: string): string {
  if (source.search(new RegExp(`\\n  ${propertyName}:`)) !== -1) {
    return replaceObjectProperty(source, propertyName, value);
  }

  const anchorProperty = propertyName === "displayName" ? "name" : "slug";
  const anchorStart = source.search(new RegExp(`\\n  ${anchorProperty}:`));
  if (anchorStart === -1) {
    return source;
  }

  const anchorValueStart = source.indexOf(":", anchorStart) + 1;
  const anchorValueEnd = findTopLevelPropertyEnd(source, anchorValueStart);
  const anchorEnd = source[anchorValueEnd] === "," ? anchorValueEnd + 1 : anchorValueEnd;

  return `${source.slice(0, anchorEnd)}\n  ${propertyName}: ${value},${source.slice(anchorEnd)}`;
}

function removeObjectProperty(source: string, propertyName: string): string {
  return source.replace(new RegExp(`\\n\\s+${propertyName}: [^\\n]+,?`, "g"), "");
}

function removeTopLevelObjectProperty(source: string, propertyName: string): string {
  const propertyStart = source.search(new RegExp(`\\n  ${propertyName}:`));

  if (propertyStart === -1) {
    return source;
  }

  const valueStart = source.indexOf(":", propertyStart) + 1;
  const valueEnd = findTopLevelPropertyEnd(source, valueStart);
  const propertyEnd = source[valueEnd] === "," ? valueEnd + 1 : valueEnd;

  return `${source.slice(0, propertyStart)}${source.slice(propertyEnd)}`;
}

function removeEmptyTopLevelObjectProperty(source: string, propertyName: string): string {
  const propertyStart = source.search(new RegExp(`\\n  ${propertyName}:`));

  if (propertyStart === -1) {
    return source;
  }

  const valueStart = source.indexOf(":", propertyStart) + 1;
  const valueEnd = findTopLevelPropertyEnd(source, valueStart);
  const propertyValue = source.slice(valueStart, valueEnd).trim().replace(/,$/, "");

  if (propertyValue !== "null" && propertyValue !== "[]") {
    return source;
  }

  const propertyEnd = source[valueEnd] === "," ? valueEnd + 1 : valueEnd;
  return `${source.slice(0, propertyStart)}${source.slice(propertyEnd)}`;
}

function wrapWithDefineCyberpunkCard(source: string): string {
  let nextSource = source;
  if (!nextSource.includes(`import { defineCyberpunkCard } from "../../define.ts";`)) {
    nextSource = nextSource.replace(
      /import type \{ [A-Za-z0-9_]+ \} from "@tcg\/cyberpunk-types";\n/,
      (importLine) => `${importLine}import { defineCyberpunkCard } from "../../define.ts";\n`,
    );
  }

  if (!nextSource.includes("= defineCyberpunkCard(")) {
    nextSource = nextSource.replace(/(export const [A-Za-z0-9_]+ = )\{/, "$1defineCyberpunkCard({");
    nextSource = nextSource.replace(/\n\} satisfies ([A-Za-z0-9_]+);/, "\n}) satisfies $1;");
  }

  return nextSource;
}

function removePrintedNullProperties(source: string): string {
  let nextSource = source;

  for (const propertyName of OMITTED_NULL_GENERATED_PROPERTIES) {
    nextSource = nextSource.replace(new RegExp(`\\n  ${propertyName}: null,?`, "g"), "");
  }

  return nextSource;
}

function renderMetadataFile(cards: StructuredSetCardDefinition[]): string {
  const metadata = Object.fromEntries(
    cards.map((card) => [metadataKey(card), metadataForCard(card)]),
  );

  return [
    `// This file is generated by @tcg/cyberpunk-parser. Do not edit manually.`,
    `import type { CardPrinting } from "@tcg/cyberpunk-types";`,
    "",
    `export interface CyberpunkCardMetadataEntry {`,
    `  i18n: {`,
    `    en: {`,
    `      name: string;`,
    `      subname?: string;`,
    `      displayName: string;`,
    `      rulesText?: string;`,
    `      flavorText?: string;`,
    `      description?: string;`,
    `      youtubeUrl?: string;`,
    `      sourceUrl?: string;`,
    `    };`,
    `  };`,
    `  printings: (Partial<CardPrinting> & Pick<CardPrinting, "id" | "collectorNumber" | "setCode">)[];`,
    `  selectedPrintingId?: string;`,
    `}`,
    "",
    `export const cyberpunkCardMetadata: Record<string, CyberpunkCardMetadataEntry> = ${toTs(metadata)};`,
    "",
  ].join("\n");
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

function bucketTypeName(bucket: CardBucket): string {
  return BUCKET_TYPE_NAME_BY_DIR[bucket.dir];
}

async function writeBucket(
  outputDir: string,
  bucket: CardBucket,
  existingFiles: ReadonlyMap<string, ExistingCardFile>,
): Promise<void> {
  const bucketDir = join(outputDir, bucket.dir);
  await mkdir(bucketDir, { recursive: true });

  const typeName = bucketTypeName(bucket);
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
    `import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";`,
    ...imports,
    "",
    ...exports,
    "",
    `export const ${config.cardsExportName}: StructuredCardDefinition[] = [`,
    ...buckets.map((bucket) => `  ...${bucket.exportName},`),
    `];`,
    "",
    `export function ${config.getBySlugName}(slug: string): StructuredCardDefinition | undefined {`,
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
    await writeBucket(setDir, bucket, existingFiles);
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
  const prm01Cards = preserveExistingIds(parsePrm01Cards(generatedCards), existingIds);
  const boxToppersRetailCards = preserveExistingIds(
    parseBoxToppersRetailCards(generatedCards),
    existingIds,
  );
  const theHeistRetailStarterDeckCards = preserveExistingIds(
    parseTheHeistRetailStarterDeckCards(generatedCards),
    existingIds,
  );
  const embracingPowerRetailStarterDeckCards = preserveExistingIds(
    parseEmbracingPowerRetailStarterDeckCards(generatedCards),
    existingIds,
  );
  const welcomeToNightCityRetailCards = preserveExistingIds(
    parseWelcomeToNightCityRetailCards(generatedCards),
    existingIds,
  );
  const retailCards = [
    ...boxToppersRetailCards,
    ...theHeistRetailStarterDeckCards,
    ...embracingPowerRetailStarterDeckCards,
    ...welcomeToNightCityRetailCards,
  ] satisfies StructuredCardDefinition[];

  await writeSetFiles(options.outputDir, SET_CONFIGS[0], alphaCards, existingFiles);
  await writeSetFiles(options.outputDir, SET_CONFIGS[1], spoilerCards, existingFiles);
  await writeSetFiles(options.outputDir, SET_CONFIGS[2], promoCards, existingFiles);
  await writeSetFiles(options.outputDir, SET_CONFIGS[3], prm01Cards, existingFiles);
  await writeSetFiles(options.outputDir, SET_CONFIGS[4], boxToppersRetailCards, existingFiles);
  await writeSetFiles(
    options.outputDir,
    SET_CONFIGS[5],
    theHeistRetailStarterDeckCards,
    existingFiles,
  );
  await writeSetFiles(
    options.outputDir,
    SET_CONFIGS[6],
    embracingPowerRetailStarterDeckCards,
    existingFiles,
  );
  await writeSetFiles(
    options.outputDir,
    SET_CONFIGS[7],
    welcomeToNightCityRetailCards,
    existingFiles,
  );
  await writeFile(
    join(options.outputDir, "card-metadata.ts"),
    renderMetadataFile([
      ...alphaCards,
      ...spoilerCards,
      ...promoCards,
      ...prm01Cards,
      ...retailCards,
    ]),
  );

  return {
    alphaCards,
    spoilerCards,
    promoCards,
    prm01Cards,
    boxToppersRetailCards,
    theHeistRetailStarterDeckCards,
    embracingPowerRetailStarterDeckCards,
    welcomeToNightCityRetailCards,
    retailCards,
  };
}
