import { decodeDeckFromUrlParam, encodeDeckToUrlParam } from "./deck-codec.js";
import { GAME_TYPES, type GameType } from "./ids.js";

export const DECK_DOCUMENT_V1_SCHEMA_VERSION = 1 as const;
export const DECK_DOCUMENT_SCHEMA_VERSION = 2 as const;
export const DECK_DOCUMENT_SUPPORTED_SCHEMA_VERSIONS = [
  DECK_DOCUMENT_V1_SCHEMA_VERSION,
  DECK_DOCUMENT_SCHEMA_VERSION,
] as const;

/** Legacy row shape retained only for explicit V1 migration. */
export interface DeckDocumentEntryV1 {
  canonicalId: string;
  printingId?: string;
  quantity: number;
}

/** Legacy lifecycle metadata. V2 derives this from the selected format definition. */
export type DeckDocumentSectionRole = "validation" | "runtime" | "presentation";

export interface DeckDocumentSectionV1 {
  id: string;
  roles?: DeckDocumentSectionRole[];
  entries: DeckDocumentEntryV1[];
}

/** Legacy cross-game envelope. New writes must use {@link DeckDocumentV2}. */
export interface DeckDocumentV1 {
  schemaVersion: typeof DECK_DOCUMENT_V1_SCHEMA_VERSION;
  game: GameType;
  formatId: string;
  name?: string;
  sections: DeckDocumentSectionV1[];
}

export interface DeckDocumentPrintingAllocationV2 {
  /** Omitted for copies which use the catalog's default presentation. */
  printingId?: string;
  quantity: number;
}

export interface DeckDocumentCardV2 {
  canonicalId: string;
  quantity: number;
}

/**
 * One canonical gameplay identity in a format-owned section. Printing
 * allocations are attached to these copies but never participate in legality.
 */
export interface DeckDocumentEntryV2 {
  card: DeckDocumentCardV2;
  appearance?: {
    printingAllocations: DeckDocumentPrintingAllocationV2[];
  };
}

export type DeckDocumentJsonValue =
  | null
  | boolean
  | number
  | string
  | readonly DeckDocumentJsonValue[]
  | DeckDocumentJsonObject;

export interface DeckDocumentJsonObject {
  [key: string]: DeckDocumentJsonValue;
}

/**
 * Authoritative V2 deck representation.
 *
 * `sections` contains registered card copies only. Section meaning, ordering,
 * cardinality, and lifecycle participation belong to the game-owned format
 * definition. `declarations` contains persistent rules-significant choices;
 * `appearance` contains cosmetics which are not attached to registered copies.
 */
export interface DeckDocumentV2<
  TGame extends GameType = GameType,
  TFormat extends string = string,
  TSection extends string = string,
  TDeclarations extends DeckDocumentJsonObject = DeckDocumentJsonObject,
  TAppearance extends DeckDocumentJsonObject = DeckDocumentJsonObject,
> {
  schemaVersion: typeof DECK_DOCUMENT_SCHEMA_VERSION;
  game: TGame;
  formatId: TFormat;
  name?: string;
  sections: Partial<Record<TSection, DeckDocumentEntryV2[]>>;
  declarations?: TDeclarations;
  appearance?: TAppearance;
}

export type DeckDocument = DeckDocumentV1 | DeckDocumentV2;

export interface DeckDocumentFlatEntry {
  canonicalId: string;
  printingId?: string;
  quantity: number;
  sectionId: string;
}

/**
 * Flatten a document without interpreting any game-owned section.
 *
 * V1 may still be filtered by its legacy data-authored roles for migration.
 * V2 role projection is intentionally rejected: callers must use the owning
 * game's format definition.
 */
export function flattenDeckDocument(
  document: DeckDocument,
  options: { role?: DeckDocumentSectionRole } = {},
): DeckDocumentFlatEntry[] {
  if (document.schemaVersion === DECK_DOCUMENT_V1_SCHEMA_VERSION) {
    return document.sections.flatMap((section) => {
      const roles = section.roles ?? (["validation", "runtime"] as const);
      if (options.role && !roles.includes(options.role)) return [];
      return section.entries.map((entry) => ({ ...entry, sectionId: section.id }));
    });
  }

  if (options.role !== undefined) {
    throw new Error("DeckDocumentV2 role projection requires a game-owned format definition");
  }

  return Object.entries(document.sections).flatMap(([sectionId, entries]) =>
    (entries ?? []).flatMap((entry) => flattenV2Entry(sectionId, entry)),
  );
}

function flattenV2Entry(sectionId: string, entry: DeckDocumentEntryV2): DeckDocumentFlatEntry[] {
  const allocations = entry.appearance?.printingAllocations;
  if (!allocations) return [{ ...entry.card, sectionId }];
  return allocations.map((allocation) => ({
    canonicalId: entry.card.canonicalId,
    ...(allocation.printingId ? { printingId: allocation.printingId } : {}),
    quantity: allocation.quantity,
    sectionId,
  }));
}

/**
 * Compatibility helper for copy flows which select one printing per canonical
 * identity. Mixed-allocation callers should update the exact V2 entry instead.
 */
export function rewriteDeckDocumentPrintings(
  document: DeckDocument,
  printingByCanonicalId: ReadonlyMap<string, string>,
): DeckDocument {
  if (document.schemaVersion === DECK_DOCUMENT_V1_SCHEMA_VERSION) {
    const rewritten: DeckDocumentV1 = {
      ...document,
      sections: document.sections.map((section) => ({
        ...section,
        entries: section.entries.map((entry) => {
          const printingId = printingByCanonicalId.get(entry.canonicalId);
          return printingId ? { ...entry, printingId } : entry;
        }),
      })),
    };
    delete rewritten.name;
    return rewritten;
  }

  const rewritten: DeckDocumentV2 = {
    ...document,
    sections: Object.fromEntries(
      Object.entries(document.sections).map(([sectionId, entries]) => [
        sectionId,
        (entries ?? []).map((entry) => {
          const printingId = printingByCanonicalId.get(entry.card.canonicalId);
          return printingId
            ? {
                ...entry,
                appearance: {
                  printingAllocations: [{ printingId, quantity: entry.card.quantity }],
                },
              }
            : entry;
        }),
      ]),
    ),
  };
  delete rewritten.name;
  return rewritten;
}

export type DeckDocumentDiagnostic =
  | { kind: "malformed"; message: string; path?: string }
  | {
      kind: "unsupported-version";
      message: string;
      receivedVersion: unknown;
      supportedVersions: typeof DECK_DOCUMENT_SUPPORTED_SCHEMA_VERSIONS;
    }
  | {
      kind: "unresolved";
      message: string;
      sectionId: string;
      entryIndex: number;
      canonicalId: string;
      printingId?: string;
    };

export type DeckDocumentEncodeResult =
  | { ok: true; value: string }
  | { ok: false; diagnostics: DeckDocumentDiagnostic[] };

export type DeckDocumentDecodeResult =
  | { ok: true; document: DeckDocument; diagnostics: DeckDocumentDiagnostic[] }
  | { ok: false; diagnostics: DeckDocumentDiagnostic[] };

export interface DeckDocumentDecodeOptions {
  resolveEntry?: (
    entry: Readonly<DeckDocumentEntryV1>,
    section: Readonly<DeckDocumentSectionV1>,
  ) => boolean;
}

export function encodeDeckDocumentToUrlParam(document: DeckDocument): DeckDocumentEncodeResult {
  const parsed = parseDeckDocument(document);
  if (!parsed.ok) return parsed;

  try {
    return { ok: true, value: encodeDeckToUrlParam(JSON.stringify(parsed.document)) };
  } catch (error) {
    return {
      ok: false,
      diagnostics: [
        {
          kind: "malformed",
          message:
            error instanceof Error
              ? `Deck document could not be encoded: ${error.message}`
              : "Deck document could not be encoded.",
        },
      ],
    };
  }
}

export function decodeDeckDocumentFromUrlParam(
  value: string | null | undefined,
  options: DeckDocumentDecodeOptions = {},
): DeckDocumentDecodeResult {
  const decoded = decodeDeckFromUrlParam(value);
  if (decoded === null) return malformed("Deck document is not valid base64url data.");

  let valueToParse: unknown;
  try {
    valueToParse = JSON.parse(decoded);
  } catch {
    return malformed("Deck document is not valid JSON.");
  }

  const parsed = parseDeckDocument(valueToParse);
  if (!parsed.ok || !options.resolveEntry) return parsed;

  const diagnostics: DeckDocumentDiagnostic[] = [];
  const grouped = groupFlatEntriesBySection(flattenDeckDocument(parsed.document));
  for (const [sectionId, entries] of grouped) {
    const section: DeckDocumentSectionV1 = { id: sectionId, entries };
    entries.forEach((entry, entryIndex) => {
      if (options.resolveEntry?.(entry, section)) return;
      diagnostics.push({
        kind: "unresolved",
        message: entry.printingId
          ? `Could not resolve ${entry.canonicalId} printing ${entry.printingId}.`
          : `Could not resolve ${entry.canonicalId}.`,
        sectionId,
        entryIndex,
        canonicalId: entry.canonicalId,
        ...(entry.printingId ? { printingId: entry.printingId } : {}),
      });
    });
  }

  return { ...parsed, diagnostics };
}

export function parseDeckDocument(value: unknown): DeckDocumentDecodeResult {
  if (!isRecord(value)) return malformed("Deck document must be an object.");
  if (value.schemaVersion === DECK_DOCUMENT_V1_SCHEMA_VERSION) return parseV1(value);
  if (value.schemaVersion === DECK_DOCUMENT_SCHEMA_VERSION) return parseV2(value);
  return {
    ok: false,
    diagnostics: [
      {
        kind: "unsupported-version",
        message: `Unsupported deck document schema version ${String(value.schemaVersion)}.`,
        receivedVersion: value.schemaVersion,
        supportedVersions: DECK_DOCUMENT_SUPPORTED_SCHEMA_VERSIONS,
      },
    ],
  };
}

function parseEnvelope(value: Record<string, unknown>): DeckDocumentDecodeResult | null {
  if (!isGameType(value.game)) return malformed("Deck document game is not supported.", "game");
  if (!isNonEmptyString(value.formatId)) {
    return malformed("Deck document formatId must be a non-empty string.", "formatId");
  }
  if (value.name !== undefined && typeof value.name !== "string") {
    return malformed("Deck document name must be a string when present.", "name");
  }
  return null;
}

function parseV1(value: Record<string, unknown>): DeckDocumentDecodeResult {
  const invalidEnvelope = parseEnvelope(value);
  if (invalidEnvelope) return invalidEnvelope;
  if (!Array.isArray(value.sections)) {
    return malformed("Deck document V1 sections must be an array.", "sections");
  }

  const sectionIds = new Set<string>();
  const sections: DeckDocumentSectionV1[] = [];
  for (let sectionIndex = 0; sectionIndex < value.sections.length; sectionIndex += 1) {
    const section = value.sections[sectionIndex];
    const sectionPath = `sections[${sectionIndex}]`;
    if (!isRecord(section)) return malformed("Deck section must be an object.", sectionPath);
    if (!isNonEmptyString(section.id)) {
      return malformed("Deck section id must be a non-empty string.", `${sectionPath}.id`);
    }
    if (sectionIds.has(section.id)) {
      return malformed(`Deck section id "${section.id}" is duplicated.`, `${sectionPath}.id`);
    }
    if (!Array.isArray(section.entries)) {
      return malformed("Deck section entries must be an array.", `${sectionPath}.entries`);
    }
    if (!isRoles(section.roles)) {
      return malformed(
        "Deck section roles must contain unique validation/runtime/presentation values.",
        `${sectionPath}.roles`,
      );
    }

    const entries: DeckDocumentEntryV1[] = [];
    for (let entryIndex = 0; entryIndex < section.entries.length; entryIndex += 1) {
      const parsed = parseV1Entry(
        section.entries[entryIndex],
        `${sectionPath}.entries[${entryIndex}]`,
      );
      if (!parsed.ok) return parsed.result;
      entries.push(parsed.entry);
    }
    sectionIds.add(section.id);
    sections.push({
      id: section.id,
      ...(section.roles ? { roles: section.roles as DeckDocumentSectionRole[] } : {}),
      entries,
    });
  }

  return {
    ok: true,
    document: {
      schemaVersion: DECK_DOCUMENT_V1_SCHEMA_VERSION,
      game: value.game as GameType,
      formatId: value.formatId as string,
      ...(value.name !== undefined ? { name: value.name as string } : {}),
      sections,
    },
    diagnostics: [],
  };
}

function parseV2(value: Record<string, unknown>): DeckDocumentDecodeResult {
  const invalidEnvelope = parseEnvelope(value);
  if (invalidEnvelope) return invalidEnvelope;
  const unexpectedRootKey = firstUnexpectedKey(value, [
    "schemaVersion",
    "game",
    "formatId",
    "name",
    "sections",
    "declarations",
    "appearance",
  ]);
  if (unexpectedRootKey) {
    return malformed(
      `DeckDocumentV2 property "${unexpectedRootKey}" is not supported.`,
      unexpectedRootKey,
    );
  }
  if (!isRecord(value.sections)) {
    return malformed("Deck document V2 sections must be an object.", "sections");
  }
  if (value.declarations !== undefined && !isJsonObject(value.declarations)) {
    return malformed("Deck document declarations must be a JSON object.", "declarations");
  }
  if (value.appearance !== undefined && !isJsonObject(value.appearance)) {
    return malformed("Deck document appearance must be a JSON object.", "appearance");
  }

  const parsedSections: Array<[string, DeckDocumentEntryV2[]]> = [];
  for (const [sectionId, rawEntries] of Object.entries(value.sections)) {
    if (!isNonEmptyString(sectionId)) {
      return malformed("Deck section id must be a non-empty string.", "sections");
    }
    if (!Array.isArray(rawEntries)) {
      return malformed("Deck section entries must be an array.", `sections.${sectionId}`);
    }
    const entries: DeckDocumentEntryV2[] = [];
    const canonicalIds = new Set<string>();
    for (let entryIndex = 0; entryIndex < rawEntries.length; entryIndex += 1) {
      const parsed = parseV2Entry(rawEntries[entryIndex], `sections.${sectionId}[${entryIndex}]`);
      if (!parsed.ok) return parsed.result;
      if (canonicalIds.has(parsed.entry.card.canonicalId)) {
        return malformed(
          `Canonical card "${parsed.entry.card.canonicalId}" is duplicated in section "${sectionId}".`,
          `sections.${sectionId}[${entryIndex}].card.canonicalId`,
        );
      }
      canonicalIds.add(parsed.entry.card.canonicalId);
      entries.push(parsed.entry);
    }
    parsedSections.push([sectionId, entries]);
  }
  const sections = Object.fromEntries(parsedSections);

  return {
    ok: true,
    document: {
      schemaVersion: DECK_DOCUMENT_SCHEMA_VERSION,
      game: value.game as GameType,
      formatId: value.formatId as string,
      ...(value.name !== undefined ? { name: value.name as string } : {}),
      sections,
      ...(value.declarations !== undefined
        ? { declarations: value.declarations as DeckDocumentJsonObject }
        : {}),
      ...(value.appearance !== undefined
        ? { appearance: value.appearance as DeckDocumentJsonObject }
        : {}),
    },
    diagnostics: [],
  };
}

function parseV1Entry(
  value: unknown,
  path: string,
): { ok: true; entry: DeckDocumentEntryV1 } | { ok: false; result: DeckDocumentDecodeResult } {
  if (!isRecord(value)) {
    return { ok: false, result: malformed("Deck entry must be an object.", path) };
  }
  if (!isNonEmptyString(value.canonicalId)) {
    return {
      ok: false,
      result: malformed(
        "Deck entry canonicalId must be a non-empty string.",
        `${path}.canonicalId`,
      ),
    };
  }
  if (value.printingId !== undefined && !isNonEmptyString(value.printingId)) {
    return {
      ok: false,
      result: malformed(
        "Deck entry printingId must be a non-empty string when present.",
        `${path}.printingId`,
      ),
    };
  }
  if (!isPositiveInteger(value.quantity)) {
    return {
      ok: false,
      result: malformed("Deck entry quantity must be a positive integer.", `${path}.quantity`),
    };
  }
  return {
    ok: true,
    entry: {
      canonicalId: value.canonicalId,
      ...(value.printingId ? { printingId: value.printingId } : {}),
      quantity: value.quantity,
    },
  };
}

function parseV2Entry(
  value: unknown,
  path: string,
): { ok: true; entry: DeckDocumentEntryV2 } | { ok: false; result: DeckDocumentDecodeResult } {
  if (!isRecord(value)) {
    return { ok: false, result: malformed("Deck entry must be an object.", path) };
  }
  const unexpectedEntryKey = firstUnexpectedKey(value, ["card", "appearance"]);
  if (unexpectedEntryKey) {
    return {
      ok: false,
      result: malformed(
        `Deck entry property "${unexpectedEntryKey}" is not supported.`,
        `${path}.${unexpectedEntryKey}`,
      ),
    };
  }
  if (!isRecord(value.card)) {
    return { ok: false, result: malformed("Deck entry card must be an object.", `${path}.card`) };
  }
  const unexpectedCardKey = firstUnexpectedKey(value.card, ["canonicalId", "quantity"]);
  if (unexpectedCardKey) {
    return {
      ok: false,
      result: malformed(
        `Deck card property "${unexpectedCardKey}" is not supported.`,
        `${path}.card.${unexpectedCardKey}`,
      ),
    };
  }
  if (!isNonEmptyString(value.card.canonicalId)) {
    return {
      ok: false,
      result: malformed(
        "Deck entry card canonicalId must be a non-empty string.",
        `${path}.card.canonicalId`,
      ),
    };
  }
  if (!isPositiveInteger(value.card.quantity)) {
    return {
      ok: false,
      result: malformed(
        "Deck entry card quantity must be a positive integer.",
        `${path}.card.quantity`,
      ),
    };
  }

  let appearance: DeckDocumentEntryV2["appearance"];
  if (value.appearance !== undefined) {
    if (!isRecord(value.appearance) || !Array.isArray(value.appearance.printingAllocations)) {
      return {
        ok: false,
        result: malformed(
          "Deck entry appearance must contain printingAllocations.",
          `${path}.appearance`,
        ),
      };
    }
    const unexpectedAppearanceKey = firstUnexpectedKey(value.appearance, ["printingAllocations"]);
    if (unexpectedAppearanceKey) {
      return {
        ok: false,
        result: malformed(
          `Deck entry appearance property "${unexpectedAppearanceKey}" is not supported.`,
          `${path}.appearance.${unexpectedAppearanceKey}`,
        ),
      };
    }
    const printingIds = new Set<string>();
    const printingAllocations: DeckDocumentPrintingAllocationV2[] = [];
    for (
      let allocationIndex = 0;
      allocationIndex < value.appearance.printingAllocations.length;
      allocationIndex += 1
    ) {
      const allocation = value.appearance.printingAllocations[allocationIndex];
      const allocationPath = `${path}.appearance.printingAllocations[${allocationIndex}]`;
      if (!isRecord(allocation)) {
        return {
          ok: false,
          result: malformed("Printing allocation must be an object.", allocationPath),
        };
      }
      const unexpectedAllocationKey = firstUnexpectedKey(allocation, ["printingId", "quantity"]);
      if (unexpectedAllocationKey) {
        return {
          ok: false,
          result: malformed(
            `Printing allocation property "${unexpectedAllocationKey}" is not supported.`,
            `${allocationPath}.${unexpectedAllocationKey}`,
          ),
        };
      }
      if (allocation.printingId !== undefined && !isNonEmptyString(allocation.printingId)) {
        return {
          ok: false,
          result: malformed(
            "Printing allocation id must be a non-empty string.",
            `${allocationPath}.printingId`,
          ),
        };
      }
      const printingKey = allocation.printingId ?? "";
      if (printingIds.has(printingKey)) {
        return {
          ok: false,
          result: malformed(
            `Printing allocation "${allocation.printingId ?? "default"}" is duplicated.`,
            `${allocationPath}.printingId`,
          ),
        };
      }
      if (!isPositiveInteger(allocation.quantity)) {
        return {
          ok: false,
          result: malformed(
            "Printing allocation quantity must be a positive integer.",
            `${allocationPath}.quantity`,
          ),
        };
      }
      printingIds.add(printingKey);
      printingAllocations.push({
        ...(allocation.printingId ? { printingId: allocation.printingId } : {}),
        quantity: allocation.quantity,
      });
    }
    const allocatedQuantity = printingAllocations.reduce((total, item) => total + item.quantity, 0);
    if (allocatedQuantity !== value.card.quantity) {
      return {
        ok: false,
        result: malformed(
          `Printing allocations must total the card quantity ${value.card.quantity} (found ${allocatedQuantity}).`,
          `${path}.appearance.printingAllocations`,
        ),
      };
    }
    appearance = { printingAllocations };
  }

  return {
    ok: true,
    entry: {
      card: { canonicalId: value.card.canonicalId, quantity: value.card.quantity },
      ...(appearance ? { appearance } : {}),
    },
  };
}

function groupFlatEntriesBySection(
  entries: readonly DeckDocumentFlatEntry[],
): Map<string, DeckDocumentEntryV1[]> {
  const grouped = new Map<string, DeckDocumentEntryV1[]>();
  for (const { sectionId, ...entry } of entries) {
    grouped.set(sectionId, [...(grouped.get(sectionId) ?? []), entry]);
  }
  return grouped;
}

function malformed(message: string, path?: string): DeckDocumentDecodeResult {
  return {
    ok: false,
    diagnostics: [{ kind: "malformed", message, ...(path ? { path } : {}) }],
  };
}

function isRoles(value: unknown): value is DeckDocumentSectionRole[] | undefined {
  return (
    value === undefined ||
    (Array.isArray(value) &&
      value.every(
        (role) => role === "validation" || role === "runtime" || role === "presentation",
      ) &&
      new Set(value).size === value.length)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsonObject(value: unknown): value is DeckDocumentJsonObject {
  return isRecord(value) && Object.values(value).every(isJsonValue);
}

function isJsonValue(value: unknown): value is DeckDocumentJsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isJsonObject(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) > 0;
}

function firstUnexpectedKey(
  value: Readonly<Record<string, unknown>>,
  allowedKeys: readonly string[],
): string | undefined {
  const allowed = new Set(allowedKeys);
  return Object.keys(value).find((key) => !allowed.has(key));
}

function isGameType(value: unknown): value is GameType {
  return GAME_TYPES.some((gameType) => gameType === value);
}
