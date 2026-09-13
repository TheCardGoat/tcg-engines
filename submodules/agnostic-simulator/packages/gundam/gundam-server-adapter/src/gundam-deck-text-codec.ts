import {
  flattenDeckDocument,
  type DeckDocument,
  type DeckDocumentEntryV1,
  type DeckDocumentEntryV2,
  type DeckDocumentV2,
} from "@tcg/game-page-contract/deck-document";

export const GUNDAM_DECK_TEXT_MAIN_SECTION_ID = "main" as const;
export const GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID = "resource" as const;
export const GUNDAM_DECK_TEXT_SIDE_SECTION_ID = "side" as const;

const HEADER = "GUNDAM DECK";
const MAIN_HEADER = "[Main Deck]";
const RESOURCE_HEADER = "[Resource Deck]";
const SIDEBOARD_HEADER = "[Sideboard]";

type GundamDeckTextSectionId =
  | typeof GUNDAM_DECK_TEXT_MAIN_SECTION_ID
  | typeof GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID
  | typeof GUNDAM_DECK_TEXT_SIDE_SECTION_ID;

export type GundamDeckTextIdentityDiagnostic = {
  kind: "unresolved-card" | "unresolved-printing" | "printing-mismatch";
  line: number;
  message: string;
  canonicalId: string;
  printingId?: string;
};

export type GundamDeckTextDiagnostic =
  | {
      kind: "malformed-line";
      line: number;
      message: string;
      input: string;
    }
  | GundamDeckTextIdentityDiagnostic
  | {
      kind: "missing-section" | "duplicate-section" | "unexpected-section";
      line: number;
      message: string;
      sectionId: GundamDeckTextSectionId;
    };

export interface GundamDeckTextDecodeResult {
  ok: boolean;
  document: DeckDocumentV2<"gundam", "standard" | "bo3", GundamDeckTextSectionId>;
  diagnostics: GundamDeckTextDiagnostic[];
}

export type GundamDeckTextEncodeDiagnostic =
  | {
      kind: "wrong-game";
      message: string;
      receivedGame: DeckDocument["game"];
    }
  | {
      kind:
        | "missing-section"
        | "duplicate-section"
        | "unknown-section"
        | "unexpected-section"
        | "unsupported-format";
      message: string;
      sectionId?: string;
      sectionIndex?: number;
      formatId?: string;
    };

export type GundamDeckTextEncodeResult =
  | { ok: true; value: string }
  | { ok: false; diagnostics: GundamDeckTextEncodeDiagnostic[] };

export interface GundamDeckTextCodecResolver {
  displayNameFor?(canonicalId: string): string | undefined;
  diagnoseEntry?(
    entry: Readonly<DeckDocumentEntryV1>,
    line: number,
  ): readonly GundamDeckTextIdentityDiagnostic[];
}

/**
 * Browser-safe codec for the canonical human-readable Gundam deck format.
 *
 * Identity resolution is injected by the consumer. Server adapters can use
 * the authoritative card package while browser consumers can use their
 * already-fetched catalog without importing game runtime code.
 */
export function encodeGundamDeckDocumentText(
  document: DeckDocument,
  resolver: Readonly<GundamDeckTextCodecResolver> = {},
): GundamDeckTextEncodeResult {
  const diagnostics = validateGundamSectionTopology(document);
  if (diagnostics.length > 0) return { ok: false, diagnostics };

  const main = entriesFor(document, GUNDAM_DECK_TEXT_MAIN_SECTION_ID);
  const resource = entriesFor(document, GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID);
  const sideboard = hasSection(document, GUNDAM_DECK_TEXT_SIDE_SECTION_ID)
    ? entriesFor(document, GUNDAM_DECK_TEXT_SIDE_SECTION_ID)
    : null;
  const lines = [
    HEADER,
    `Name: ${JSON.stringify(document.name ?? "")}`,
    `Format: ${document.formatId}`,
    "",
    MAIN_HEADER,
    ...main.map((entry) => formatEntry(entry, resolver)),
    "",
    RESOURCE_HEADER,
    ...resource.map((entry) => formatEntry(entry, resolver)),
    ...(sideboard
      ? ["", SIDEBOARD_HEADER, ...sideboard.map((entry) => formatEntry(entry, resolver))]
      : []),
  ];
  return { ok: true, value: `${lines.join("\n")}\n` };
}

export function decodeGundamDeckDocumentText(
  text: string,
  resolver: Readonly<GundamDeckTextCodecResolver> = {},
): GundamDeckTextDecodeResult {
  const diagnostics: GundamDeckTextDiagnostic[] = [];
  const sections: Record<GundamDeckTextSectionId, DeckDocumentEntryV1[]> = {
    [GUNDAM_DECK_TEXT_MAIN_SECTION_ID]: [],
    [GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID]: [],
    [GUNDAM_DECK_TEXT_SIDE_SECTION_ID]: [],
  };
  const seenSections = new Set<string>();
  let activeSection: GundamDeckTextSectionId | null = null;
  let name: string | undefined;
  let formatId = "standard";
  let formatLine = 0;
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);

  for (let index = 0; index < lines.length; index++) {
    const input = lines[index] ?? "";
    const line = index + 1;
    const trimmed = input.trim();
    if (!trimmed || trimmed === HEADER) continue;

    const sectionId = sectionIdForHeader(trimmed);
    if (sectionId) {
      if (seenSections.has(sectionId)) {
        diagnostics.push({
          kind: "duplicate-section",
          line,
          sectionId,
          message: `${trimmed} appears more than once.`,
        });
      }
      seenSections.add(sectionId);
      activeSection = sectionId;
      continue;
    }

    if (trimmed.startsWith("Name:")) {
      const rawName = trimmed.slice("Name:".length).trim();
      name = decodeName(rawName);
      if (name === undefined) {
        diagnostics.push({
          kind: "malformed-line",
          line,
          input,
          message: "Name must be plain text or a valid JSON string.",
        });
      }
      continue;
    }
    if (trimmed.startsWith("Format:")) {
      const candidate = trimmed.slice("Format:".length).trim();
      if (!candidate) {
        diagnostics.push({
          kind: "malformed-line",
          line,
          input,
          message: "Format must be a non-empty identifier.",
        });
      } else {
        formatId = candidate;
        formatLine = line;
      }
      continue;
    }

    if (!activeSection) {
      diagnostics.push({
        kind: "malformed-line",
        line,
        input,
        message: `Deck entry must follow ${MAIN_HEADER}, ${RESOURCE_HEADER}, or ${SIDEBOARD_HEADER}.`,
      });
      continue;
    }

    const identityText = trimmed.split(/\s+\|\s+/, 1)[0] ?? "";
    const match = /^(\d+)\s+(\S+)(?:\s+printing=(\S+))?$/.exec(identityText);
    if (!match) {
      diagnostics.push({
        kind: "malformed-line",
        line,
        input,
        message: "Expected: <quantity> <canonical-id> [printing=<printing-id>] [| name].",
      });
      continue;
    }

    const quantity = Number(match[1]);
    const canonicalId = match[2] ?? "";
    const printingId = match[3];
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      diagnostics.push({
        kind: "malformed-line",
        line,
        input,
        message: "Quantity must be a positive integer.",
      });
      continue;
    }

    const entry: DeckDocumentEntryV1 = {
      canonicalId,
      ...(printingId ? { printingId } : {}),
      quantity,
    };
    diagnostics.push(...(resolver.diagnoseEntry?.(entry, line) ?? []));
    sections[activeSection].push(entry);
  }

  const expectedSections: readonly GundamDeckTextSectionId[] =
    formatId === "bo3"
      ? [
          GUNDAM_DECK_TEXT_MAIN_SECTION_ID,
          GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID,
          GUNDAM_DECK_TEXT_SIDE_SECTION_ID,
        ]
      : [GUNDAM_DECK_TEXT_MAIN_SECTION_ID, GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID];
  if (formatId !== "standard" && formatId !== "bo3") {
    diagnostics.push({
      kind: "malformed-line",
      line: formatLine,
      input: `Format: ${formatId}`,
      message: `Unsupported Gundam deck format "${formatId}".`,
    });
  }
  if (formatId === "standard" && seenSections.has(GUNDAM_DECK_TEXT_SIDE_SECTION_ID)) {
    diagnostics.push({
      kind: "unexpected-section",
      line: lines.findIndex((line) => line.trim() === SIDEBOARD_HEADER) + 1,
      sectionId: GUNDAM_DECK_TEXT_SIDE_SECTION_ID,
      message: "Standard Gundam decks cannot contain a sideboard.",
    });
  }
  for (const sectionId of expectedSections) {
    if (!seenSections.has(sectionId)) {
      diagnostics.push({
        kind: "missing-section",
        line: 0,
        sectionId,
        message: `Missing ${sectionHeader(sectionId)}.`,
      });
    }
  }

  const document: GundamDeckTextDecodeResult["document"] = {
    schemaVersion: 2,
    game: "gundam",
    formatId: formatId === "bo3" ? "bo3" : "standard",
    ...(name !== undefined && name !== "" ? { name } : {}),
    sections: {
      main: toV2Entries(sections.main),
      resource: toV2Entries(sections.resource),
      ...(formatId === "bo3" ? { side: toV2Entries(sections.side) } : {}),
    },
  };
  return {
    ok: !diagnostics.some(isFatalDecodeDiagnostic),
    document,
    diagnostics,
  };
}

function validateGundamSectionTopology(document: DeckDocument): GundamDeckTextEncodeDiagnostic[] {
  const diagnostics: GundamDeckTextEncodeDiagnostic[] = [];
  if (document.game !== "gundam") {
    diagnostics.push({
      kind: "wrong-game",
      message: `Expected a Gundam deck document, received ${document.game}.`,
      receivedGame: document.game,
    });
  }
  if (document.formatId !== "standard" && document.formatId !== "bo3") {
    diagnostics.push({
      kind: "unsupported-format",
      message: `Unsupported Gundam deck format "${document.formatId}".`,
      formatId: document.formatId,
    });
  }

  const sectionIds =
    document.schemaVersion === 1
      ? document.sections.map((section) => section.id)
      : Object.keys(document.sections);
  const counts = new Map<string, number>();
  const expectedSections =
    document.formatId === "bo3"
      ? new Set<string>([
          GUNDAM_DECK_TEXT_MAIN_SECTION_ID,
          GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID,
          GUNDAM_DECK_TEXT_SIDE_SECTION_ID,
        ])
      : new Set<string>([GUNDAM_DECK_TEXT_MAIN_SECTION_ID, GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID]);
  sectionIds.forEach((sectionId, sectionIndex) => {
    counts.set(sectionId, (counts.get(sectionId) ?? 0) + 1);
    if (!expectedSections.has(sectionId)) {
      diagnostics.push({
        kind:
          document.formatId === "standard" && sectionId === GUNDAM_DECK_TEXT_SIDE_SECTION_ID
            ? "unexpected-section"
            : "unknown-section",
        message:
          document.formatId === "standard" && sectionId === GUNDAM_DECK_TEXT_SIDE_SECTION_ID
            ? "Standard Gundam decks cannot contain a sideboard."
            : `Unsupported Gundam deck section "${sectionId}".`,
        sectionId,
        sectionIndex,
      });
    }
  });

  for (const sectionId of expectedSections) {
    const count = counts.get(sectionId) ?? 0;
    if (count === 0) {
      diagnostics.push({
        kind: "missing-section",
        message: `Missing Gundam deck section "${sectionId}".`,
        sectionId,
      });
    } else if (count > 1) {
      diagnostics.push({
        kind: "duplicate-section",
        message: `Gundam deck section "${sectionId}" appears ${count} times.`,
        sectionId,
      });
    }
  }
  return diagnostics;
}

function hasSection(document: DeckDocument, sectionId: GundamDeckTextSectionId): boolean {
  return document.schemaVersion === 1
    ? document.sections.some((section) => section.id === sectionId)
    : Object.hasOwn(document.sections, sectionId);
}

function entriesFor(
  document: DeckDocument,
  sectionId: GundamDeckTextSectionId,
): DeckDocumentEntryV1[] {
  return flattenDeckDocument(document)
    .filter((entry) => entry.sectionId === sectionId)
    .map(({ canonicalId, printingId, quantity }) => ({
      canonicalId,
      ...(printingId ? { printingId } : {}),
      quantity,
    }));
}

function toV2Entries(entries: readonly DeckDocumentEntryV1[]): DeckDocumentEntryV2[] {
  const grouped = new Map<string, DeckDocumentEntryV1[]>();
  for (const entry of entries) {
    grouped.set(entry.canonicalId, [...(grouped.get(entry.canonicalId) ?? []), entry]);
  }
  return [...grouped].map(([canonicalId, rows]) => {
    const quantity = rows.reduce((sum, row) => sum + row.quantity, 0);
    const hasPrinting = rows.some((row) => row.printingId !== undefined);
    const allocationQuantities = new Map<string | undefined, number>();
    for (const row of rows) {
      allocationQuantities.set(
        row.printingId,
        (allocationQuantities.get(row.printingId) ?? 0) + row.quantity,
      );
    }
    return {
      card: { canonicalId, quantity },
      ...(hasPrinting
        ? {
            appearance: {
              printingAllocations: [...allocationQuantities].map(([printingId, allocation]) => ({
                ...(printingId ? { printingId } : {}),
                quantity: allocation,
              })),
            },
          }
        : {}),
    };
  });
}

function sectionIdForHeader(value: string): GundamDeckTextSectionId | null {
  if (value === MAIN_HEADER) return GUNDAM_DECK_TEXT_MAIN_SECTION_ID;
  if (value === RESOURCE_HEADER) return GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID;
  if (value === SIDEBOARD_HEADER) return GUNDAM_DECK_TEXT_SIDE_SECTION_ID;
  return null;
}

function sectionHeader(sectionId: GundamDeckTextSectionId): string {
  if (sectionId === GUNDAM_DECK_TEXT_MAIN_SECTION_ID) return MAIN_HEADER;
  if (sectionId === GUNDAM_DECK_TEXT_RESOURCE_SECTION_ID) return RESOURCE_HEADER;
  return SIDEBOARD_HEADER;
}

function decodeName(value: string): string | undefined {
  if (!value.startsWith('"')) return value;
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === "string" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function formatEntry(
  entry: DeckDocumentEntryV1,
  resolver: Readonly<GundamDeckTextCodecResolver>,
): string {
  const displayName = resolver.displayNameFor?.(entry.canonicalId);
  const identity = `${entry.quantity} ${entry.canonicalId}${
    entry.printingId ? ` printing=${entry.printingId}` : ""
  }`;
  return displayName ? `${identity} | ${displayName}` : identity;
}

function isFatalDecodeDiagnostic(diagnostic: GundamDeckTextDiagnostic): boolean {
  return (
    diagnostic.kind === "malformed-line" ||
    diagnostic.kind === "missing-section" ||
    diagnostic.kind === "duplicate-section" ||
    diagnostic.kind === "unexpected-section"
  );
}
