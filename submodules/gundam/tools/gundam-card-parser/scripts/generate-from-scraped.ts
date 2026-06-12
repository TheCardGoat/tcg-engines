import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  BaseCard,
  Card,
  CommandCard,
  PilotCard,
  ResourceCard,
  UnitCard,
} from "@tcg/gundam-types";
import {
  CARDS_DIR,
  cardNumber,
  fmtDir,
  renderCatalogMetadataLines,
  slugify,
  toConstName,
  updateRootIndex,
  writeSetIndex,
} from "./_helpers.ts";
import { NormalizationError, normalize } from "../src/normalizer.ts";
import type { RawGundamCard } from "../src/types/scraper.ts";
import { parseEffect } from "./parseEffect.ts";

const DATA_DIR = join(new URL("..", import.meta.url).pathname, "data/scraped");
const OVERWRITE_EXISTING = process.env["GUNDAM_GENERATOR_OVERWRITE"] === "1";

type CardBucket = Map<string, Card>;
type TypeBucket = Map<Card["type"], CardBucket>;
type SetBucket = Map<string, TypeBucket>;

function sourceSetId(raw: RawGundamCard): string | null {
  const source = raw.getIt && raw.getIt !== "-" ? raw.getIt : (raw.set?.name ?? "");
  const bracketed = source.match(/\[([A-Z0-9-]+)\]/);
  return bracketed?.[1]?.toLowerCase().replace(/[^a-z0-9]+/g, "") ?? null;
}

function cardSetId(card: Card): string {
  return card.cardNumber.split("-")[0]?.toLowerCase() ?? "unknown";
}

function legacyResourceSetId(card: Card): string | null {
  if (card.type !== "resource" || !card.cardNumber.startsWith("R-")) return null;
  const number = Number.parseInt(cardNumber(card.cardNumber), 10);
  if (number === 1) return "st01";
  if (number >= 2 && number <= 9) return "gd01";
  if (number >= 10 && number <= 19) return "gd02";
  return null;
}

function renderEffects(card: Card): { hasEffects: boolean; text: string } {
  const effects = parseEffect(card.effect, card.type);
  return {
    hasEffects: effects.length > 0,
    text:
      effects.length > 0
        ? `  effects: ${JSON.stringify(effects, null, 2)} as CardEffect[],`
        : "  effects: [],",
  };
}

function baseLines(card: Card): string[] {
  const { hasEffects, text } = renderEffects(card);
  const typeName = `${card.type[0]!.toUpperCase()}${card.type.slice(1)}Card`;
  const importTypes = hasEffects ? `CardEffect, ${typeName}` : typeName;
  const lines = [
    `import type { ${importTypes} } from "@tcg/gundam-types";`,
    "",
    `export const ${toConstName(card.name, cardNumber(card.cardNumber), cardSetId(card))}: ${typeName} = {`,
    `  cardNumber: ${JSON.stringify(card.cardNumber)},`,
    `  name: ${JSON.stringify(card.name)},`,
    `  type: ${JSON.stringify(card.type)},`,
  ];

  if ("color" in card && card.color !== undefined)
    lines.push(`  color: ${JSON.stringify(card.color)},`);
  lines.push(`  traits: ${JSON.stringify(card.traits)},`);
  lines.push(...renderCatalogMetadataLines(card));
  if (card.sourceTitle !== undefined) {
    lines.push(`  sourceTitle: ${JSON.stringify(card.sourceTitle)},`);
  }
  lines.push(`  level: ${card.level},`);
  lines.push(`  cost: ${card.cost},`);
  return lines.concat([text]);
}

function renderUnit(card: UnitCard): string {
  const lines = baseLines(card);
  const insertAt = lines.findIndex((line) => line.startsWith("  effects:"));
  lines.splice(insertAt, 0, `  ap: ${card.ap},`, `  hp: ${card.hp},`);
  if (card.linkCondition !== undefined)
    lines.splice(insertAt + 2, 0, `  linkCondition: ${JSON.stringify(card.linkCondition)},`);
  if (card.zone !== undefined)
    lines.splice(
      insertAt + (card.linkCondition !== undefined ? 3 : 2),
      0,
      `  zone: ${JSON.stringify(card.zone)},`,
    );
  if (card.effect !== undefined)
    lines.splice(
      lines.findIndex((line) => line.startsWith("  effects:")),
      0,
      `  effect: ${JSON.stringify(card.effect)},`,
    );
  return finishRender(card, lines);
}

function renderPilot(card: PilotCard): string {
  const lines = baseLines(card);
  const insertAt = lines.findIndex((line) => line.startsWith("  effects:"));
  lines.splice(insertAt, 0, `  apBonus: ${card.apBonus},`, `  hpBonus: ${card.hpBonus},`);
  if (card.effect !== undefined)
    lines.splice(
      lines.findIndex((line) => line.startsWith("  effects:")),
      0,
      `  effect: ${JSON.stringify(card.effect)},`,
    );
  return finishRender(card, lines);
}

function renderCommand(card: CommandCard): string {
  const lines = baseLines(card);
  const insertAt = lines.findIndex((line) => line.startsWith("  effects:"));
  if (card.pilotName !== undefined) {
    lines.splice(
      insertAt,
      0,
      `  pilotName: ${JSON.stringify(card.pilotName)},`,
      `  apBonus: ${card.apBonus ?? 0},`,
      `  hpBonus: ${card.hpBonus ?? 0},`,
    );
  }
  if (card.effect !== undefined)
    lines.splice(
      lines.findIndex((line) => line.startsWith("  effects:")),
      0,
      `  effect: ${JSON.stringify(card.effect)},`,
    );
  return finishRender(card, lines);
}

function renderBase(card: BaseCard): string {
  const lines = baseLines(card);
  const insertAt = lines.findIndex((line) => line.startsWith("  effects:"));
  lines.splice(insertAt, 0, `  hp: ${card.hp},`);
  if (card.effect !== undefined)
    lines.splice(
      lines.findIndex((line) => line.startsWith("  effects:")),
      0,
      `  effect: ${JSON.stringify(card.effect)},`,
    );
  return finishRender(card, lines);
}

function renderResource(card: ResourceCard): string {
  const lines = baseLines(card);
  if (card.effect !== undefined)
    lines.splice(
      lines.findIndex((line) => line.startsWith("  effects:")),
      0,
      `  effect: ${JSON.stringify(card.effect)},`,
    );
  return finishRender(card, lines);
}

function finishRender(card: Card, lines: string[]): string {
  lines.push(`  keywordEffects: ${JSON.stringify(card.keywordEffects)},`);
  lines.push(`  rarity: ${JSON.stringify(card.rarity)},`);
  lines.push("};", "");
  return lines.join("\n");
}

function renderCard(card: Card): string {
  switch (card.type) {
    case "unit":
      return renderUnit(card);
    case "pilot":
      return renderPilot(card);
    case "command":
      return renderCommand(card);
    case "base":
      return renderBase(card);
    case "resource":
      return renderResource(card);
  }
}

function addAliases(src: string, primaryConstName: string, aliases: string[]): string {
  if (aliases.length === 0) return src;
  return `${src}${aliases.map((alias) => `export const ${alias} = ${primaryConstName};`).join("\n")}\n`;
}

function exportedConstNames(src: string): string[] {
  return [...src.matchAll(/^export const ([A-Za-z_$][\w$]*)/gm)].map((match) => match[1]!);
}

function mergeIndexExports(dir: string, generatedExports: string[]): string[] {
  const existingIndex = join(dir, "index.ts");
  const existingExports = existsSync(existingIndex)
    ? (readFileSync(existingIndex, "utf8")
        .match(/^export[\s\S]*?;\n?/gm)
        ?.map((line) => line.trim()) ?? [])
    : [];
  const exportedNames = new Set(
    existingExports.flatMap((line) =>
      [...line.matchAll(/\b([A-Za-z_$][\w$]*)\b(?=,|\s*})/g)].map((match) => match[1]!),
    ),
  );
  const filteredGenerated = generatedExports.filter((line) => {
    const name = line.match(/export \{ ([A-Za-z_$][\w$]*) \}/)?.[1];
    if (!name || exportedNames.has(name)) return false;
    exportedNames.add(name);
    return true;
  });
  return [...new Set([...existingExports, ...filteredGenerated])];
}

function typeBucketFor(buckets: SetBucket, setId: string, type: Card["type"]): CardBucket {
  const byType = buckets.get(setId) ?? new Map<Card["type"], CardBucket>();
  buckets.set(setId, byType);
  const byCard = byType.get(type) ?? new Map<string, Card>();
  byType.set(type, byCard);
  return byCard;
}

function loadRawCards(): RawGundamCard[] {
  if (!existsSync(DATA_DIR)) {
    throw new Error(`Scraped data directory does not exist: ${DATA_DIR}`);
  }

  return readdirSync(DATA_DIR)
    .filter((file) => file.endsWith(".json") && file !== "manifest.json")
    .sort()
    .flatMap((file) => JSON.parse(readFileSync(join(DATA_DIR, file), "utf8")) as RawGundamCard[]);
}

function normalizeSourceTitle(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "-") return undefined;

  const normalized = trimmed
    .replace(/Hathaway"s/g, "Hathaway's")
    .replace(/^Mobile Suit Gundam Mobile Suit Gundam GQuuuuuuX$/i, "Mobile Suit Gundam GQuuuuuuX");

  const lower = normalized.toLowerCase();
  if (lower === "mobile suit gundam uc") return "Mobile Suit Gundam Unicorn";
  if (lower === "mobile suit gundam seed destiny") return "Mobile Suit Gundam SEED Destiny";
  if (lower === "mobile suit gundam iron-blooded orphans") {
    return "Mobile Suit Gundam: Iron-Blooded Orphans";
  }

  return normalized;
}

function normalizeCardNumberKey(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/_/g, "-");
}

function printingsByCardNumber(
  rawCards: RawGundamCard[],
): Map<string, NonNullable<Card["printings"]>> {
  const byCardNumber = new Map<string, NonNullable<Card["printings"]>>();

  for (const raw of rawCards) {
    try {
      const card = normalize(raw);
      const printing = card.printings?.[0];
      if (!printing) continue;
      const printings = byCardNumber.get(card.cardNumber) ?? [];
      if (!printings.some((existing) => existing.id === printing.id)) {
        printings.push(printing);
      }
      byCardNumber.set(card.cardNumber, printings);
    } catch (err) {
      if (err instanceof NormalizationError) continue;
      throw err;
    }
  }

  for (const printings of byCardNumber.values()) {
    printings.sort((a, b) =>
      a.collectorNumber.localeCompare(b.collectorNumber, "en", {
        numeric: true,
        sensitivity: "base",
      }),
    );
  }

  return byCardNumber;
}

function withKnownPrintings<T extends Card>(card: T, printings: NonNullable<Card["printings"]>): T {
  const selectedPrintingId =
    printings.find((printing) => printing.id === card.id)?.id ??
    card.selectedPrintingId ??
    printings[0]?.id ??
    null;
  return {
    ...card,
    printings,
    selectedPrintingId,
  };
}

function writeSourceTitleIndex(cards: RawGundamCard[]): void {
  const sourceTitleByCardNumber: Record<string, string> = {};
  for (const raw of cards) {
    const sourceTitle = normalizeSourceTitle(raw.sourceTitle);
    const cardNumber = normalizeCardNumberKey(raw.id);
    const baseCardNumber = normalizeCardNumberKey(raw.code);
    if (!sourceTitle) continue;
    if (cardNumber) sourceTitleByCardNumber[cardNumber] = sourceTitle;
    if (baseCardNumber && sourceTitleByCardNumber[baseCardNumber] === undefined) {
      sourceTitleByCardNumber[baseCardNumber] = sourceTitle;
    }
  }

  const body = [
    "export const sourceTitleByCardNumber = {",
    ...Object.entries(sourceTitleByCardNumber)
      .sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))
      .map(
        ([cardNumber, sourceTitle]) =>
          `  ${JSON.stringify(cardNumber)}: ${JSON.stringify(sourceTitle)},`,
      ),
    "} as const;",
    "",
    "export type GundamSourceTitleCardNumber = keyof typeof sourceTitleByCardNumber;",
    "",
  ].join("\n");

  writeFileSync(join(CARDS_DIR, "source-titles.ts"), body);
}

const buckets: SetBucket = new Map();
const aliasesByCardNumber = new Map<string, Set<string>>();
const chosenIdsByCardNumber = new Map<string, string>();
let skippedReprints = 0;
const normalizationErrors: string[] = [];

const rawCards = loadRawCards();
const knownPrintingsByCardNumber = printingsByCardNumber(rawCards);
writeSourceTitleIndex(rawCards);

for (const raw of rawCards) {
  try {
    const normalized = normalize(raw);
    const card = withKnownPrintings(
      normalized,
      knownPrintingsByCardNumber.get(normalized.cardNumber) ?? normalized.printings ?? [],
    );
    const aliasSet = sourceSetId(raw);
    if (aliasSet && aliasSet !== cardSetId(card)) {
      const aliases = aliasesByCardNumber.get(card.cardNumber) ?? new Set<string>();
      aliases.add(toConstName(card.name, cardNumber(card.cardNumber), aliasSet));
      aliasesByCardNumber.set(card.cardNumber, aliases);
    }
    const legacySet = legacyResourceSetId(card);
    if (legacySet) {
      const aliases = aliasesByCardNumber.get(card.cardNumber) ?? new Set<string>();
      aliases.add(toConstName(card.name, cardNumber(card.cardNumber), legacySet));
      aliasesByCardNumber.set(card.cardNumber, aliases);
    }
    const bucket = typeBucketFor(buckets, cardSetId(card), card.type);
    if (bucket.has(card.cardNumber)) {
      const chosenId = chosenIdsByCardNumber.get(card.cardNumber) ?? "";
      if (/_p\d+$/i.test(chosenId) && !/_p\d+$/i.test(raw.id)) {
        bucket.set(card.cardNumber, card);
        chosenIdsByCardNumber.set(card.cardNumber, raw.id);
        continue;
      }
      skippedReprints++;
      continue;
    }
    bucket.set(card.cardNumber, card);
    chosenIdsByCardNumber.set(card.cardNumber, raw.id);
  } catch (err) {
    if (err instanceof NormalizationError) {
      normalizationErrors.push(err.message);
      continue;
    }
    throw err;
  }
}

let written = 0;
for (const [setId, byType] of buckets) {
  for (const [type, cards] of byType) {
    const dir = join(CARDS_DIR, setId, type);
    mkdirSync(dir, { recursive: true });

    const exports: string[] = [];
    for (const card of [...cards.values()].sort((a, b) =>
      a.cardNumber.localeCompare(b.cardNumber, "en", { numeric: true }),
    )) {
      const num = cardNumber(card.cardNumber);
      const filename = `${num}-${slugify(card.name)}.ts`;
      const constName = toConstName(card.name, num, setId);
      const filePath = join(dir, filename);
      const src =
        existsSync(filePath) && !OVERWRITE_EXISTING
          ? readFileSync(filePath, "utf8")
          : addAliases(
              renderCard(card).replace(/export const \w+:/, `export const ${constName}:`),
              constName,
              [...(aliasesByCardNumber.get(card.cardNumber) ?? [])].filter(
                (alias) => alias !== constName,
              ),
            );
      if (!existsSync(filePath) || OVERWRITE_EXISTING) writeFileSync(filePath, src);
      const exportName = exportedConstNames(src)[0] ?? constName;
      exports.push(`export { ${exportName} } from "./${filename}";`);
      written++;
    }
    writeSetIndex(dir, mergeIndexExports(dir, exports));
  }
}

updateRootIndex();
fmtDir(CARDS_DIR);

console.log(`Generated ${written} card file(s) from scraped JSON.`);
console.log(`Skipped ${skippedReprints} alternate printing(s) with duplicate card numbers.`);
if (normalizationErrors.length > 0) {
  console.log(`Skipped ${normalizationErrors.length} card(s) due to normalization errors:`);
  for (const message of normalizationErrors) console.log(`  ${message}`);
}
