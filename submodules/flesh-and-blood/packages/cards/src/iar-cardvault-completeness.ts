import {
  hydrateFleshAndBloodCatalogSourceParts,
  type SparseFleshAndBloodCardDataCatalog,
  type SparseFleshAndBloodPrintingsCatalog,
} from "@tcg/flesh-and-blood-types/catalog";

const FINISH_SUFFIX = /-(RF|CF|GF|MV|TF|AA|EA)$/iu;
const LANGUAGE_PREFIX = /^(EN_|FR_|JA_|DE_|ES_|IT_)/u;
const PITCH_COLOR: Readonly<Record<string, string>> = {
  "1": "red",
  "2": "yellow",
  "3": "blue",
  "4": "purple",
};
const CATALOG_RARITY_WORD: Readonly<Record<string, string>> = {
  C: "common",
  R: "rare",
  M: "majestic",
  L: "legendary",
  F: "fabled",
  B: "basic",
  T: "token",
  V: "marvel",
  S: "super",
  P: "promo",
};

export interface IarPrintedIdentity {
  readonly name: string;
  readonly setCode: string;
  readonly collectorNumber: string;
  readonly pitch: string;
  readonly color: string;
  readonly typeText: string;
  readonly types: readonly string[];
  readonly cost: string;
  readonly power: string;
  readonly defense: string;
  readonly health: string;
  readonly functionalText: string;
  readonly rarity: string;
  readonly canonicalId?: string;
  readonly slug?: string;
  readonly printId?: string;
}

export interface IarFieldMismatch {
  readonly collectorNumber: string;
  readonly name: string;
  readonly pitch: string;
  readonly field: string;
  readonly official: string;
  readonly catalog: string;
}

export interface IarCompletenessReport {
  readonly complete: boolean;
  readonly officialUniqueNamePitch: number;
  readonly officialUniqueCollectorNumbers: number;
  readonly catalogUniqueNamePitch: number;
  readonly catalogUniqueCollectorNumbers: number;
  readonly missingInCatalog: readonly IarPrintedIdentity[];
  readonly extraInCatalog: readonly IarPrintedIdentity[];
  readonly mismatchedFields: readonly IarFieldMismatch[];
}

export function normalizeIarCollectorNumber(printId: string): string {
  return printId.replace(LANGUAGE_PREFIX, "").replace(FINISH_SUFFIX, "");
}

export function normalizeIarPitch(value: unknown): string {
  if (value == null || value === "" || value === "-") return "";
  const text = String(value).trim();
  return /^\d+$/u.test(text) ? String(Number(text)) : text;
}

export function normalizeIarPrintedStat(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

export function normalizeIarFunctionalText(value: string): string {
  return value
    .replaceAll("{br}", "\n")
    .replaceAll("{BR}", "\n")
    .replace(/<br\s*\/?>/giu, "\n")
    .replace(/<[^>]+>/gu, "")
    .replaceAll("\u2019", "'")
    .replaceAll("\u2018", "'")
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replace(/[ \t]+/gu, " ")
    .replace(/ *\n */gu, "\n")
    .replace(/\n{2,}/gu, "\n")
    .trim();
}

export function catalogRarityWord(rarity: string): string {
  return CATALOG_RARITY_WORD[rarity] ?? rarity.trim().toLowerCase();
}

export function colorFromPitch(pitch: string, catalogColor = ""): string {
  return PITCH_COLOR[pitch] ?? catalogColor.trim().toLowerCase();
}

function printedStatsEqual(left: string, right: string): boolean {
  if (left === right) return true;
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  return left !== "" && right !== "" && leftNumber === rightNumber;
}

export function enumerateIarCatalogIdentities(
  cardData: SparseFleshAndBloodCardDataCatalog,
  printingData: SparseFleshAndBloodPrintingsCatalog,
): IarPrintedIdentity[] {
  const catalog = hydrateFleshAndBloodCatalogSourceParts(cardData, printingData);
  const identities: IarPrintedIdentity[] = [];
  for (const card of catalog.cards) {
    const iarPrintings = card.printings.filter((printing) => printing.setCode === "IAR");
    if (iarPrintings.length === 0) continue;
    const byCollector = new Map<string, (typeof iarPrintings)[number][]>();
    for (const printing of iarPrintings) {
      const group = byCollector.get(printing.collectorNumber) ?? [];
      group.push(printing);
      byCollector.set(printing.collectorNumber, group);
    }
    const pitch = normalizeIarPitch(card.pitch);
    for (const [collectorNumber, variants] of byCollector) {
      const preferred = variants.find((printing) => printing.rarity !== "V") ?? variants[0];
      identities.push({
        name: card.name,
        setCode: "IAR",
        collectorNumber,
        pitch,
        color: colorFromPitch(pitch, card.color ?? ""),
        typeText: card.typeText,
        types: [...card.types],
        cost: normalizeIarPrintedStat(card.cost),
        power: normalizeIarPrintedStat(card.power),
        defense: normalizeIarPrintedStat(card.defense),
        health: normalizeIarPrintedStat(card.health),
        functionalText: card.functionalTextPlain ?? "",
        rarity: preferred.rarity,
        canonicalId: card.canonicalId,
        slug: card.slug,
      });
    }
  }
  return identities.sort(
    (left, right) =>
      left.collectorNumber.localeCompare(right.collectorNumber) ||
      left.name.localeCompare(right.name),
  );
}

function pickCatalogIdentity(
  official: IarPrintedIdentity,
  catalogByCollector: ReadonlyMap<string, readonly IarPrintedIdentity[]>,
): IarPrintedIdentity | undefined {
  const candidates = catalogByCollector.get(official.collectorNumber) ?? [];
  return candidates.find((row) => row.name === official.name) ?? candidates[0];
}

export function diffIarOfficialAgainstCatalog(
  official: readonly IarPrintedIdentity[],
  catalog: readonly IarPrintedIdentity[],
): IarCompletenessReport {
  const catalogByCollector = new Map<string, IarPrintedIdentity[]>();
  for (const row of catalog) {
    const group = catalogByCollector.get(row.collectorNumber) ?? [];
    group.push(row);
    catalogByCollector.set(row.collectorNumber, group);
  }
  const officialCollectors = new Set(official.map((row) => row.collectorNumber));
  const missingInCatalog = official.filter((row) => !catalogByCollector.has(row.collectorNumber));
  const extraInCatalog = catalog.filter((row) => !officialCollectors.has(row.collectorNumber));
  const mismatchedFields: IarFieldMismatch[] = [];

  const pushMismatch = (
    officialRow: IarPrintedIdentity,
    field: string,
    officialValue: string,
    catalogValue: string,
    equal: (left: string, right: string) => boolean = (left, right) => left === right,
  ): void => {
    if (equal(officialValue, catalogValue)) return;
    mismatchedFields.push({
      collectorNumber: officialRow.collectorNumber,
      name: officialRow.name,
      pitch: officialRow.pitch,
      field,
      official: officialValue,
      catalog: catalogValue,
    });
  };

  for (const officialRow of official) {
    const catalogRow = pickCatalogIdentity(officialRow, catalogByCollector);
    if (!catalogRow) continue;
    pushMismatch(officialRow, "name", officialRow.name, catalogRow.name);
    pushMismatch(officialRow, "setCode", "IAR", catalogRow.setCode);
    pushMismatch(
      officialRow,
      "collectorNumber",
      officialRow.collectorNumber,
      catalogRow.collectorNumber,
    );
    pushMismatch(officialRow, "pitch", officialRow.pitch, catalogRow.pitch);
    pushMismatch(officialRow, "color", officialRow.color, catalogRow.color);
    pushMismatch(officialRow, "typeText", officialRow.typeText.trim(), catalogRow.typeText.trim());
    for (const field of ["cost", "power", "defense", "health"] as const) {
      pushMismatch(officialRow, field, officialRow[field], catalogRow[field], printedStatsEqual);
    }
    pushMismatch(
      officialRow,
      "functionalText",
      normalizeIarFunctionalText(officialRow.functionalText),
      normalizeIarFunctionalText(catalogRow.functionalText),
    );
    pushMismatch(officialRow, "rarity", officialRow.rarity, catalogRarityWord(catalogRow.rarity));
  }

  return {
    complete: missingInCatalog.length === 0 && mismatchedFields.length === 0,
    officialUniqueNamePitch: new Set(official.map((row) => `${row.name}\0${row.pitch}`)).size,
    officialUniqueCollectorNumbers: officialCollectors.size,
    catalogUniqueNamePitch: new Set(catalog.map((row) => `${row.name}\0${row.pitch}`)).size,
    catalogUniqueCollectorNumbers: catalogByCollector.size,
    missingInCatalog,
    extraInCatalog,
    mismatchedFields,
  };
}
