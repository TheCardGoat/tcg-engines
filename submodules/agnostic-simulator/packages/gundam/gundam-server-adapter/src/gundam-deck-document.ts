import * as gundamCards from "@tcg/gundam-cards";
import {
  defaultGundamPrintingId,
  getGundamCanonicalForCardId,
  getGundamPrintingInfo,
  GUNDAM_EX_BASE_CANONICAL_IDS,
  GUNDAM_EX_RESOURCE_CANONICAL_IDS,
} from "@tcg/gundam-cards";
import type { DeckList } from "@tcg/gundam-engine";
import type {
  DeckDocument,
  DeckDocumentDiagnostic,
  DeckDocumentEntryV1,
  DeckDocumentJsonObject,
  DeckDocumentJsonValue,
  DeckDocumentV1,
  DeckDocumentV2,
} from "@tcg/game-page-contract/deck-document";
import type { Card } from "@tcg/gundam-types";
import type {
  DeckCard,
  DeckInterchangeAdapter,
  DeckInterchangeResult,
} from "@tcg/shared/game-adapter";
import { defineGameDeckInterchangeAdapter } from "@tcg/shared/game-adapter";

export const GUNDAM_MAIN_DECK_SECTION_ID = "main";
export const GUNDAM_RESOURCE_DECK_SECTION_ID = "resource";
export const GUNDAM_SIDEBOARD_SECTION_ID = "side";
/** V1-only section id retained so active decks can be migrated without loss. */
export const GUNDAM_SETUP_SECTION_ID = "setup";
const GUNDAM_V1_SECTION_IDS = new Set<string>([
  GUNDAM_MAIN_DECK_SECTION_ID,
  GUNDAM_RESOURCE_DECK_SECTION_ID,
  GUNDAM_SIDEBOARD_SECTION_ID,
  GUNDAM_SETUP_SECTION_ID,
]);

export type GundamDeckFormatId = "standard" | "bo3";
export type GundamDeckSectionId =
  | typeof GUNDAM_MAIN_DECK_SECTION_ID
  | typeof GUNDAM_RESOURCE_DECK_SECTION_ID
  | typeof GUNDAM_SIDEBOARD_SECTION_ID;
export type GundamDeckDocumentV2 = DeckDocumentV2<
  "gundam",
  GundamDeckFormatId,
  GundamDeckSectionId
>;

export type GundamSetupPresentationSlotKey = "ex-base" | "ex-resource";
export type GundamSetupPresentation = Record<GundamSetupPresentationSlotKey, string>;

export interface GundamSetupPresentationSlot {
  key: GundamSetupPresentationSlotKey;
  canonicalId: string;
  defaultPrintingId: string;
  variantCanonicalIds: readonly string[];
}

export function getGundamSetupPresentationSlots(): readonly GundamSetupPresentationSlot[] {
  return [
    {
      key: "ex-base",
      canonicalId: "EXB-001",
      defaultPrintingId: defaultGundamPrintingId("EXB-001") ?? "EXB-001",
      variantCanonicalIds: GUNDAM_EX_BASE_CANONICAL_IDS.filter((id) => id !== "EXB-001"),
    },
    {
      key: "ex-resource",
      canonicalId: "EXR-001",
      defaultPrintingId: defaultGundamPrintingId("EXR-001") ?? "EXR-001",
      variantCanonicalIds: GUNDAM_EX_RESOURCE_CANONICAL_IDS.filter((id) => id !== "EXR-001"),
    },
  ];
}

const gundamSetupAppearanceFields = [
  {
    id: "setup.ex-base",
    label: "EX Base artwork",
    kind: "printing-reference",
    required: false,
  },
  {
    id: "setup.ex-resource",
    label: "EX Resource artwork",
    kind: "printing-reference",
    required: false,
  },
] as const;

const cardsByCanonicalId: ReadonlyMap<string, Card> = (() => {
  const result = new Map<string, Card>();
  for (const value of Object.values(gundamCards)) {
    if (isCard(value) && !result.has(value.canonicalId)) result.set(value.canonicalId, value);
  }
  return result;
})();

const gundamDeckDocumentAdapter = defineGameDeckInterchangeAdapter({
  game: "gundam",
  defaultFormatId: "standard",
  formats: {
    standard: {
      id: "standard",
      label: "Standard",
      appearanceFields: gundamSetupAppearanceFields,
      sections: [
        {
          id: GUNDAM_MAIN_DECK_SECTION_ID,
          label: "Main Deck",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 50,
        },
        {
          id: GUNDAM_RESOURCE_DECK_SECTION_ID,
          label: "Resource Deck",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 10,
        },
      ],
    },
    bo3: {
      id: "bo3",
      label: "Best of Three",
      appearanceFields: gundamSetupAppearanceFields,
      sections: [
        {
          id: GUNDAM_MAIN_DECK_SECTION_ID,
          label: "Main Deck",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 50,
        },
        {
          id: GUNDAM_RESOURCE_DECK_SECTION_ID,
          label: "Resource Deck",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 10,
        },
        {
          id: GUNDAM_SIDEBOARD_SECTION_ID,
          label: "Sideboard",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 10,
        },
      ],
    },
  },
  migrateV1: migrateGundamV1,
  validateExtensions: validateGundamAppearance,
});

export const gundamDeckInterchangeAdapter: DeckInterchangeAdapter<
  "gundam",
  GundamDeckSectionId,
  GundamDeckFormatId
> = {
  ...gundamDeckDocumentAdapter,
  toDocument: gundamDeckCardsToDocument,
  fromDocument: gundamDeckDocumentToCards,
};

export function gundamDeckCardsToDocument(input: {
  formatId: GundamDeckFormatId;
  name?: string;
  deck: ReadonlyArray<DeckCard>;
}): GundamDeckDocumentV2 {
  const sections: Partial<Record<GundamDeckSectionId, DeckDocumentEntryV1[]>> = {
    main: [],
    resource: [],
    ...(input.formatId === "bo3" ? { side: [] } : {}),
  };
  for (const entry of input.deck) {
    const canonicalId =
      entry.canonicalId ??
      (entry.printingId ? getGundamPrintingInfo(entry.printingId)?.canonicalId : null) ??
      getGundamCanonicalForCardId(entry.cardId) ??
      entry.cardId;
    const card = cardsByCanonicalId.get(canonicalId);
    const sectionId =
      (entry.sectionId as GundamDeckSectionId | undefined) ??
      (card?.type === "resource" ? GUNDAM_RESOURCE_DECK_SECTION_ID : GUNDAM_MAIN_DECK_SECTION_ID);
    const target = sections[sectionId];
    if (!target) {
      throw new Error(`Gundam ${input.formatId} decks do not support section "${sectionId}".`);
    }
    target.push({
      canonicalId,
      ...(entry.printingId ? { printingId: entry.printingId } : {}),
      quantity: entry.quantity,
    });
  }
  return gundamDeckDocumentAdapter.createDocument({
    formatId: input.formatId,
    ...(input.name === undefined ? {} : { name: input.name }),
    sections,
  });
}

export function gundamSetupPresentationFromDocument(
  document: DeckDocument,
): GundamSetupPresentation {
  if (document.schemaVersion === 1) return setupPresentationFromV1(document);
  const setup = isJsonObject(document.appearance?.setup) ? document.appearance.setup : {};
  return Object.fromEntries(
    getGundamSetupPresentationSlots().map((slot) => [
      slot.key,
      typeof setup[slot.key] === "string" ? setup[slot.key] : slot.defaultPrintingId,
    ]),
  ) as GundamSetupPresentation;
}

export function applyGundamSetupPresentationToDocument(
  document: DeckDocument,
  selections: Readonly<Partial<Record<GundamSetupPresentationSlotKey, string>>>,
): GundamDeckDocumentV2 {
  const migration = gundamDeckDocumentAdapter.migrateDocument(document);
  if (!migration.ok) {
    throw new Error(migration.diagnostics.map((diagnostic) => diagnostic.message).join("; "));
  }
  const migrated = migration.document;
  if (migrated.game !== "gundam")
    throw new Error(`Expected a Gundam deck, received ${migrated.game}`);
  const current = gundamSetupPresentationFromDocument(migrated);
  return {
    ...(migrated as GundamDeckDocumentV2),
    appearance: {
      ...(migrated.appearance ?? {}),
      setup: { ...current, ...selections },
    },
  };
}

export function gundamDeckDocumentToCards(document: DeckDocument): DeckInterchangeResult {
  if (document.schemaVersion === 1) {
    const migrationDiagnostics = validateGundamV1Migration(document);
    if (migrationDiagnostics.length > 0) return { deck: [], diagnostics: migrationDiagnostics };
  }
  const mapped = gundamDeckDocumentAdapter.projectDocument(document);
  const diagnostics = [...mapped.diagnostics];
  mapped.deck.forEach((entry, entryIndex) => {
    const canonicalId = entry.canonicalId ?? entry.cardId;
    const card = cardsByCanonicalId.get(canonicalId);
    const printing = entry.printingId ? getGundamPrintingInfo(entry.printingId) : null;
    if (!card) {
      diagnostics.push(unresolved(entry.sectionId ?? "", entryIndex, entry, "Unknown Gundam card"));
    } else if (printing && printing.canonicalId !== canonicalId) {
      diagnostics.push(
        unresolved(
          entry.sectionId ?? "",
          entryIndex,
          entry,
          `Printing ${entry.printingId} belongs to ${printing.canonicalId}, not ${canonicalId}`,
        ),
      );
    } else if (entry.printingId && !printing) {
      diagnostics.push(
        unresolved(entry.sectionId ?? "", entryIndex, entry, "Unknown Gundam printing"),
      );
    } else if (
      (entry.sectionId === GUNDAM_RESOURCE_DECK_SECTION_ID && card.type !== "resource") ||
      (entry.sectionId !== GUNDAM_RESOURCE_DECK_SECTION_ID && card.type === "resource")
    ) {
      diagnostics.push({
        kind: "malformed",
        message:
          entry.sectionId === GUNDAM_RESOURCE_DECK_SECTION_ID
            ? `Only Resource cards can be in the Gundam Resource Deck (found ${card.name}).`
            : `Resource cards must be in the Gundam Resource Deck (found ${card.name} in ${entry.sectionId}).`,
        path: `sections.${entry.sectionId}.entries[${entryIndex}]`,
      });
    }
  });
  return { ...mapped, diagnostics };
}

export function gundamDeckListToDocument(
  deck: DeckList,
  printingSelections: Readonly<Record<string, string>> = {},
): GundamDeckDocumentV2 {
  const printingFor = (entry: { cardNumber: string; printingId?: string }): string | undefined =>
    entry.printingId ?? printingSelections[entry.cardNumber];
  const entry = (value: { cardNumber: string; count: number; printingId?: string }) => ({
    canonicalId: getGundamCanonicalForCardId(value.cardNumber) ?? value.cardNumber,
    ...(printingFor(value) ? { printingId: printingFor(value) } : {}),
    quantity: value.count,
  });
  return gundamDeckDocumentAdapter.createDocument({
    formatId: deck.sideboard === undefined ? "standard" : "bo3",
    name: deck.name,
    sections: {
      main: deck.cards.map(entry),
      resource: [entry(deck.resource)],
      ...(deck.sideboard === undefined ? {} : { side: deck.sideboard.map(entry) }),
    },
  });
}

export interface GundamDeckListDocumentResult {
  deck: DeckList;
  documentCards: readonly DeckCard[];
  diagnostics: DeckDocumentDiagnostic[];
  printingSelections: Record<string, string>;
}

export function gundamDeckDocumentToDeckList(document: DeckDocument): GundamDeckListDocumentResult {
  const mapped = gundamDeckDocumentToCards(document);
  const main = mapped.deck.filter((entry) => entry.sectionId === GUNDAM_MAIN_DECK_SECTION_ID);
  const resources = mapped.deck.filter(
    (entry) => entry.sectionId === GUNDAM_RESOURCE_DECK_SECTION_ID,
  );
  const sideboard = mapped.deck.filter((entry) => entry.sectionId === GUNDAM_SIDEBOARD_SECTION_ID);
  const diagnostics = [...mapped.diagnostics];
  const resourceCanonicalIds = new Set(resources.map((entry) => entry.canonicalId ?? entry.cardId));
  if (resources.length === 0 || resourceCanonicalIds.size !== 1) {
    diagnostics.push({
      kind: "malformed",
      message: `Gundam Resource Deck must contain one Resource identity (found ${resourceCanonicalIds.size}).`,
      path: "sections.resource",
    });
  }
  const resource = resources[0] ?? {
    cardId: "",
    canonicalId: "",
    sectionId: GUNDAM_RESOURCE_DECK_SECTION_ID,
    quantity: 0,
  };
  const resourceQuantity = resources.reduce((sum, value) => sum + value.quantity, 0);
  const printingsByCanonical = new Map<string, Set<string>>();
  for (const entry of mapped.deck) {
    if (!entry.printingId) continue;
    const canonicalId = entry.canonicalId ?? entry.cardId;
    const printings = printingsByCanonical.get(canonicalId) ?? new Set<string>();
    printings.add(entry.printingId);
    printingsByCanonical.set(canonicalId, printings);
  }
  const printingSelections: Record<string, string> = {};
  for (const [canonicalId, printings] of printingsByCanonical) {
    if (printings.size === 1) printingSelections[canonicalId] = [...printings][0]!;
  }
  const row = (value: DeckCard) => ({
    cardNumber: value.canonicalId ?? value.cardId,
    count: value.quantity,
    ...(value.printingId ? { printingId: value.printingId } : {}),
  });
  return {
    deck: {
      name: document.name ?? "Imported Gundam deck",
      cards: main.map(row),
      resource: {
        cardNumber: resource.canonicalId ?? resource.cardId,
        count: resourceQuantity,
        ...(resources.length === 1 && resource.printingId
          ? { printingId: resource.printingId }
          : {}),
      },
      ...(document.formatId === "bo3" ? { sideboard: sideboard.map(row) } : {}),
    },
    documentCards: mapped.deck,
    diagnostics,
    printingSelections,
  };
}

function migrateGundamV1(
  document: DeckDocumentV1,
):
  | { ok: true; document: GundamDeckDocumentV2 }
  | { ok: false; diagnostics: DeckDocumentDiagnostic[] } {
  const migrationDiagnostics = validateGundamV1Migration(document);
  if (migrationDiagnostics.length > 0) {
    return { ok: false, diagnostics: migrationDiagnostics };
  }
  const formatId = document.formatId === "bo3" ? "bo3" : "standard";
  const sections: Partial<Record<GundamDeckSectionId, DeckDocumentEntryV1[]>> = {
    main: document.sections.find((section) => section.id === "main")?.entries ?? [],
    resource: document.sections.find((section) => section.id === "resource")?.entries ?? [],
    ...(formatId === "bo3"
      ? { side: document.sections.find((section) => section.id === "side")?.entries ?? [] }
      : {}),
  };
  const migrated = gundamDeckDocumentAdapter.createDocument({
    formatId,
    ...(document.name === undefined ? {} : { name: document.name }),
    sections,
  });
  const setup = setupPresentationFromV1(document);
  const hadSetup = document.sections.some((section) => section.id === GUNDAM_SETUP_SECTION_ID);
  return {
    ok: true,
    document: hadSetup ? { ...migrated, appearance: { setup } } : migrated,
  };
}

function validateGundamV1Migration(document: DeckDocumentV1): DeckDocumentDiagnostic[] {
  if (document.formatId !== "standard" && document.formatId !== "bo3") {
    return [
      {
        kind: "malformed",
        message: `Unsupported Gundam deck format "${document.formatId}".`,
        path: "formatId",
      },
    ];
  }
  const unsupportedSection = document.sections.find(
    (section) => !GUNDAM_V1_SECTION_IDS.has(section.id),
  );
  if (unsupportedSection) {
    return [
      {
        kind: "malformed",
        message: `Unsupported Gundam V1 section "${unsupportedSection.id}".`,
        path: `sections.${unsupportedSection.id}`,
      },
    ];
  }
  const side = document.sections.find((section) => section.id === GUNDAM_SIDEBOARD_SECTION_ID);
  if (document.formatId === "standard" && (side?.entries.length ?? 0) > 0) {
    return [
      {
        kind: "malformed",
        message: "Standard Gundam decks cannot contain a sideboard.",
        path: "sections.side",
      },
    ];
  }
  if (document.formatId === "bo3" && !side) {
    return [
      {
        kind: "malformed",
        message: 'Gundam bo3 deck is missing section "side".',
        path: "sections",
      },
    ];
  }
  return [];
}

function setupPresentationFromV1(document: DeckDocumentV1): GundamSetupPresentation {
  const section = document.sections.find((candidate) => candidate.id === GUNDAM_SETUP_SECTION_ID);
  const printingByCanonical = new Map(
    section?.entries.map((entry) => [entry.canonicalId, entry.printingId] as const) ?? [],
  );
  return Object.fromEntries(
    getGundamSetupPresentationSlots().map((slot) => [
      slot.key,
      printingByCanonical.get(slot.canonicalId) ?? slot.defaultPrintingId,
    ]),
  ) as GundamSetupPresentation;
}

function validateGundamAppearance(document: GundamDeckDocumentV2): DeckDocumentDiagnostic[] {
  if (document.appearance?.setup === undefined) return [];
  if (!isJsonObject(document.appearance.setup)) {
    return [
      {
        kind: "malformed",
        message: "Gundam appearance.setup must be an object.",
        path: "appearance.setup",
      },
    ];
  }
  const diagnostics: DeckDocumentDiagnostic[] = [];
  const slots = new Map(getGundamSetupPresentationSlots().map((slot) => [slot.key, slot]));
  for (const [key, value] of Object.entries(document.appearance.setup)) {
    const slot = slots.get(key as GundamSetupPresentationSlotKey);
    if (!slot) {
      diagnostics.push({
        kind: "malformed",
        message: `Unknown Gundam setup appearance slot "${key}".`,
        path: `appearance.setup.${key}`,
      });
      continue;
    }
    const printing = typeof value === "string" ? getGundamPrintingInfo(value) : null;
    const accepted = new Set([slot.canonicalId, ...slot.variantCanonicalIds]);
    if (!printing || !accepted.has(printing.canonicalId)) {
      diagnostics.push({
        kind: "malformed",
        message: `Invalid printing "${String(value)}" for Gundam setup slot "${key}".`,
        path: `appearance.setup.${key}`,
      });
    }
  }
  return diagnostics;
}

function unresolved(
  sectionId: string,
  entryIndex: number,
  entry: DeckCard,
  prefix: string,
): DeckDocumentDiagnostic {
  const canonicalId = entry.canonicalId ?? entry.cardId;
  return {
    kind: "unresolved",
    message: `${prefix}: ${canonicalId}${entry.printingId ? ` (${entry.printingId})` : ""}.`,
    sectionId,
    entryIndex,
    canonicalId,
    ...(entry.printingId ? { printingId: entry.printingId } : {}),
  };
}

function isJsonObject(value: DeckDocumentJsonValue | undefined): value is DeckDocumentJsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "canonicalId" in value &&
    typeof (value as { canonicalId: unknown }).canonicalId === "string" &&
    "cardNumber" in value &&
    typeof (value as { cardNumber: unknown }).cardNumber === "string" &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
}
