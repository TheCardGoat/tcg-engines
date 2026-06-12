import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

const SCRIPT_DIR = new URL(".", import.meta.url).pathname;
const CARD_ROOT = join(SCRIPT_DIR, "../../../packages/cards/src/cards");
const SCRAPED_DIR = join(SCRIPT_DIR, "../data/scraped");
const ASSET_ROOT =
  process.env["GUNDAM_CARD_ASSET_ROOT"] ?? "/Users/esposo/Projects/assets/public/gundam/cards";
const R2_BASE_URL = "https://r2.tcg.online/public/gundam/cards";

const METADATA_FIELDS = new Set([
  "id",
  "externalId",
  "slug",
  "displayName",
  "rulesText",
  "set",
  "printNumber",
  "printings",
  "selectedPrintingId",
  "imageUrl",
  "sourceImageUrl",
  "artist",
  "sourceUrl",
  "legality",
]);

interface RawGundamCard {
  id: string;
  code: string;
  name: string;
  rarity: string;
  effect: string | null;
  images: {
    small: string | null;
    large: string | null;
  };
  getIt: string | null;
  set: {
    id: string;
    name: string;
    packageId?: string;
  } | null;
}

interface CardSetMetadata {
  code: string;
  name: string;
  packageId?: string;
}

interface PrintingMetadata {
  id: string;
  collectorNumber: string;
  cardNumber: string;
  set: CardSetMetadata;
  rarity: string | null;
  finish: "standard" | "parallel";
  imageUrl?: string;
  sourceImageUrl?: string;
  productName?: string;
}

interface CardMetadata {
  id: string;
  externalId: string;
  slug: string;
  displayName: string;
  rulesText?: string | null;
  set: CardSetMetadata;
  printNumber: string;
  printings: PrintingMetadata[];
  selectedPrintingId: string;
  imageUrl?: string;
  sourceImageUrl?: string;
  legality: "legal";
}

interface ParsedCardFile {
  cardNumber: string;
  name: string;
  rarity: string;
  setDir: string;
  filePath: string;
}

const SET_NAME_BY_CODE: Record<string, string> = {
  BETA: "Edition Beta",
  EXB: "Basic Cards",
  EXBP: "Promotion card",
  EXR: "Basic Cards",
  EXRP: "Promotion card",
  GD01: "Newtype Rising [GD01]",
  GD02: "Dual Impact [GD02]",
  GD03: "Steel Requiem [GD03]",
  GD04: "Phantom Aria [GD04]",
  R: "Basic Cards",
  RP: "Promotion card",
  ST01: "Heroic Beginnings [ST01]",
  ST02: "Wings of Advance [ST02]",
  ST03: "Zeon's Rush [ST03]",
  ST04: "SEED Strike [ST04]",
  ST05: "Iron Bloom [ST05]",
  ST06: "Clan Unity [ST06]",
  ST07: "Celestial Drive [ST07]",
  ST08: "Flash of Radiance [ST08]",
  ST09: "Destiny Ignition [ST09]",
  T: "Token Cards",
};

const CARD_RARITY_BY_RAW: Record<string, string> = {
  C: "common",
  Common: "common",
  U: "uncommon",
  UC: "uncommon",
  Uncommon: "uncommon",
  R: "rare",
  Rare: "rare",
  LR: "legendRare",
  LegendRare: "legendRare",
  "Legend Rare": "legendRare",
  P: "promo",
  Promo: "promo",
  Promotion: "promo",
  SR: "superRare",
  SuperRare: "superRare",
  "Super Rare": "superRare",
  SCR: "secretRare",
  SEC: "secretRare",
  SecretRare: "secretRare",
  "Secret Rare": "secretRare",
};

function readJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function walkFiles(dir: string, predicate: (path: string) => boolean): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(path, predicate));
    else if (predicate(path)) out.push(path);
  }
  return out;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizePrintingId(value: string): string {
  return value.trim().replace(/-p(\d+)$/i, "_p$1");
}

function canonicalCardNumber(cardNumber: string): string {
  return cardNumber.replace(/-p\d+$/i, "");
}

function codeFromProduct(raw: RawGundamCard): string {
  const source = raw.getIt && raw.getIt !== "-" ? raw.getIt : (raw.set?.name ?? "");
  const bracketed = source.match(/\[([A-Z0-9-]+)\]/);
  if (bracketed?.[1]) return bracketed[1].toUpperCase();
  if (raw.getIt === "Edition Beta") return "BETA";
  return raw.set?.id?.toUpperCase() ?? raw.code.split("-")[0]?.toUpperCase() ?? "UNKNOWN";
}

function setForCode(code: string, raw?: RawGundamCard): CardSetMetadata {
  const normalizedCode = code.toUpperCase();
  const rawPackageId = raw?.set?.packageId;
  return {
    code: normalizedCode,
    name:
      raw?.getIt?.trim() ||
      raw?.set?.name?.trim() ||
      SET_NAME_BY_CODE[normalizedCode] ||
      normalizedCode,
    ...(rawPackageId ? { packageId: rawPackageId } : {}),
  };
}

function parseRawRarity(raw: string): string | null {
  const normalized = raw.trim().replace(/(?:\s*\+\s*)+$/, "");
  return CARD_RARITY_BY_RAW[normalized] ?? null;
}

function assetIdFromPath(path: string): string {
  return basename(path, ".webp");
}

function assetUrl(relPath: string): string {
  return `${R2_BASE_URL}/${relPath.split("/").map(encodeURIComponent).join("/")}`;
}

function loadRawCards(): RawGundamCard[] {
  return readdirSync(SCRAPED_DIR)
    .filter((file) => file.endsWith(".json") && file !== "manifest.json")
    .sort()
    .flatMap((file) => readJsonFile<RawGundamCard[]>(join(SCRAPED_DIR, file)));
}

function loadAssets(): Map<string, string[]> {
  const byId = new Map<string, string[]>();
  if (!existsSync(ASSET_ROOT)) return byId;
  for (const path of walkFiles(ASSET_ROOT, (file) => file.endsWith(".webp"))) {
    const relPath = relative(ASSET_ROOT, path).replaceAll("\\", "/");
    const id = assetIdFromPath(path);
    const paths = byId.get(id) ?? [];
    paths.push(relPath);
    byId.set(id, paths);
  }
  for (const paths of byId.values()) paths.sort();
  return byId;
}

function preferredAssetPath(
  printingId: string,
  setCode: string,
  assetPathsById: Map<string, string[]>,
): string | undefined {
  const paths = assetPathsById.get(printingId);
  if (!paths || paths.length === 0) return undefined;
  const preferredFolder = setCode.toLowerCase();
  return (
    paths.find((path) => path.startsWith(`${preferredFolder}/`)) ??
    paths.find((path) => !path.startsWith("beta/")) ??
    paths[0]
  );
}

function rawPrinting(raw: RawGundamCard, assetPathsById: Map<string, string[]>): PrintingMetadata {
  const id = normalizePrintingId(raw.id);
  const setCode = codeFromProduct(raw);
  const assetPath = preferredAssetPath(id, setCode, assetPathsById);
  const sourceImageUrl = raw.images.large ?? raw.images.small ?? undefined;
  return {
    id,
    collectorNumber: id,
    cardNumber: raw.code,
    set: setForCode(setCode, raw),
    rarity: parseRawRarity(raw.rarity),
    finish: raw.rarity.includes("+") || /_p\d+$/i.test(id) ? "parallel" : "standard",
    ...(assetPath ? { imageUrl: assetUrl(assetPath) } : {}),
    ...(sourceImageUrl
      ? { sourceImageUrl }
      : assetPath
        ? { sourceImageUrl: assetUrl(assetPath) }
        : {}),
    ...(raw.getIt && raw.getIt !== "-" ? { productName: raw.getIt } : {}),
  };
}

function assetOnlyPrinting(
  printingId: string,
  canonicalNumber: string,
  selectedRarity: string,
  assetPathsById: Map<string, string[]>,
): PrintingMetadata | undefined {
  const paths = assetPathsById.get(printingId);
  if (!paths?.[0]) return undefined;
  const path = paths.find((candidate) => !candidate.startsWith("beta/")) ?? paths[0];
  const setCode = path.split("/")[0]?.toUpperCase() ?? canonicalNumber.split("-")[0] ?? "UNKNOWN";
  const url = assetUrl(path);
  return {
    id: printingId,
    collectorNumber: printingId,
    cardNumber: canonicalNumber,
    set: setForCode(setCode),
    rarity: selectedRarity,
    finish: /_p\d+$/i.test(printingId) ? "parallel" : "standard",
    imageUrl: url,
    sourceImageUrl: url,
    productName: SET_NAME_BY_CODE[setCode] ?? setCode,
  };
}

function printingsForCard(
  parsed: ParsedCardFile,
  rawByCode: Map<string, RawGundamCard[]>,
  assetPathsById: Map<string, string[]>,
): PrintingMetadata[] {
  const canonicalNumber = canonicalCardNumber(parsed.cardNumber);
  const printingsById = new Map<string, PrintingMetadata>();

  for (const raw of rawByCode.get(canonicalNumber) ?? []) {
    const printing = rawPrinting(raw, assetPathsById);
    printingsById.set(printing.id, printing);
  }

  for (const id of assetPathsById.keys()) {
    if (id !== canonicalNumber && !id.startsWith(`${canonicalNumber}_p`)) continue;
    if (printingsById.has(id)) continue;
    const printing = assetOnlyPrinting(id, canonicalNumber, parsed.rarity, assetPathsById);
    if (printing) printingsById.set(id, printing);
  }

  if (printingsById.size === 0) {
    const fallbackId = normalizePrintingId(parsed.cardNumber);
    printingsById.set(fallbackId, {
      id: fallbackId,
      collectorNumber: fallbackId,
      cardNumber: canonicalNumber,
      set: setForCode(parsed.setDir.toUpperCase()),
      rarity: parsed.rarity,
      finish: /_p\d+$/i.test(fallbackId) ? "parallel" : "standard",
    });
  }

  return [...printingsById.values()].sort((left, right) =>
    left.collectorNumber.localeCompare(right.collectorNumber, "en", {
      numeric: true,
      sensitivity: "base",
    }),
  );
}

function selectedPrintingId(parsed: ParsedCardFile, printings: PrintingMetadata[]): string {
  const exactId = normalizePrintingId(parsed.cardNumber);
  const exact = printings.find((printing) => printing.id === exactId);
  const folderSet = parsed.setDir.toUpperCase();
  if (exact?.set.code === folderSet) return exactId;

  const matchingSet = printings.find((printing) => printing.set.code === folderSet);
  if (matchingSet) return matchingSet.id;

  if (exact) return exactId;

  const canonicalId = canonicalCardNumber(parsed.cardNumber);
  if (printings.some((printing) => printing.id === canonicalId)) return canonicalId;

  return printings[0]!.id;
}

function cardMetadata(parsed: ParsedCardFile, printings: PrintingMetadata[]): CardMetadata {
  const id = selectedPrintingId(parsed, printings);
  const selected = printings.find((printing) => printing.id === id) ?? printings[0]!;
  return {
    id,
    externalId: `gundam:${id.toLowerCase()}`,
    slug: `${slugify(parsed.name)}-${id.toLowerCase().replace(/_/g, "-")}`,
    displayName: parsed.name,
    set: selected.set,
    printNumber: id,
    printings,
    selectedPrintingId: id,
    ...(selected.imageUrl ? { imageUrl: selected.imageUrl } : {}),
    ...(selected.sourceImageUrl ? { sourceImageUrl: selected.sourceImageUrl } : {}),
    legality: "legal",
  };
}

function parseCardFile(filePath: string, source: string): ParsedCardFile | null {
  const cardNumber = source.match(/\n\s*cardNumber:\s*"([^"]+)"/)?.[1];
  const name = source.match(/\n\s*name:\s*"([^"]+)"/)?.[1];
  const rarity = source.match(/\n\s*rarity:\s*"([^"]+)"/)?.[1];
  if (!cardNumber || !name || !rarity) return null;
  const setDir = relative(CARD_ROOT, filePath).split("/")[0] ?? "unknown";
  return { cardNumber, name, rarity, setDir, filePath };
}

function removeExistingMetadata(lines: string[]): string[] {
  const output: string[] = [];
  let skipping = false;
  for (const line of lines) {
    const topLevelProperty = line.match(/^  ([A-Za-z][A-Za-z0-9]*):/);
    if (topLevelProperty && METADATA_FIELDS.has(topLevelProperty[1]!)) {
      skipping = true;
      continue;
    }
    if (skipping && (/^  [A-Za-z][A-Za-z0-9]*:/.test(line) || line === "};")) {
      skipping = false;
    }
    if (!skipping) output.push(line);
  }
  return output;
}

function renderMetadata(metadata: CardMetadata): string[] {
  return [
    `  id: ${JSON.stringify(metadata.id)},`,
    `  externalId: ${JSON.stringify(metadata.externalId)},`,
    `  slug: ${JSON.stringify(metadata.slug)},`,
    `  displayName: ${JSON.stringify(metadata.displayName)},`,
    ...(metadata.rulesText !== undefined
      ? [`  rulesText: ${JSON.stringify(metadata.rulesText)},`]
      : []),
    `  set: ${JSON.stringify(metadata.set)},`,
    `  printNumber: ${JSON.stringify(metadata.printNumber)},`,
    `  printings: ${JSON.stringify(metadata.printings, null, 2)},`,
    `  selectedPrintingId: ${JSON.stringify(metadata.selectedPrintingId)},`,
    ...(metadata.imageUrl ? [`  imageUrl: ${JSON.stringify(metadata.imageUrl)},`] : []),
    ...(metadata.sourceImageUrl
      ? [`  sourceImageUrl: ${JSON.stringify(metadata.sourceImageUrl)},`]
      : []),
    `  legality: ${JSON.stringify(metadata.legality)},`,
  ];
}

function insertMetadata(source: string, metadata: CardMetadata): string {
  const lines = removeExistingMetadata(source.split("\n"));
  const traitsIndex = lines.findIndex((line) => line.startsWith("  traits:"));
  if (traitsIndex < 0) throw new Error("Could not find traits property");
  lines.splice(traitsIndex + 1, 0, ...renderMetadata(metadata));
  return lines.join("\n");
}

const rawCards = loadRawCards();
const rawByCode = new Map<string, RawGundamCard[]>();
for (const raw of rawCards) {
  const rows = rawByCode.get(raw.code) ?? [];
  rows.push(raw);
  rawByCode.set(raw.code, rows);
}

const assetPathsById = loadAssets();
const cardFiles = walkFiles(
  CARD_ROOT,
  (file) =>
    file.endsWith(".ts") &&
    !file.endsWith(".test.ts") &&
    !file.endsWith("/index.ts") &&
    !file.endsWith("/source-titles.ts"),
).sort();

let updated = 0;
let skipped = 0;
for (const filePath of cardFiles) {
  const source = readFileSync(filePath, "utf8");
  const parsed = parseCardFile(filePath, source);
  if (!parsed) {
    skipped++;
    continue;
  }
  const printings = printingsForCard(parsed, rawByCode, assetPathsById);
  const metadata = cardMetadata(parsed, printings);
  const nextSource = insertMetadata(source, metadata);
  if (nextSource !== source) {
    writeFileSync(filePath, nextSource);
    updated++;
  }
}

console.log(
  `Enriched ${updated} Gundam card definition file(s) with catalog metadata; skipped ${skipped}.`,
);
