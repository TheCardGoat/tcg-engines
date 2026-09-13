import { grandArchiveCardsByCanonicalId } from "@tcg/grand-archive-cards";
import type { DeckDocumentDiagnostic, DeckDocumentV2 } from "@tcg/game-page-contract";
import { defineGameDeckInterchangeAdapter } from "@tcg/shared/game-adapter";

const GREATER_BOON_OF_PROXIA_ID = "WKA37tNxtw";

export const grandArchiveDeckInterchangeAdapter = defineGameDeckInterchangeAdapter({
  game: "grand-archive",
  defaultFormatId: "standard",
  formats: {
    standard: grandArchiveFormat("standard", "Standard"),
    draft: grandArchiveFormat("draft", "Draft"),
    pantheon: grandArchiveFormat("pantheon", "Pantheon"),
  },
  validateExtensions: validateGrandArchiveExtensions,
});

function grandArchiveFormat(id: "standard" | "draft" | "pantheon", label: string) {
  const includesSideboard = id !== "pantheon";
  return {
    id,
    label,
    declarationFields: [
      {
        id: "startingChampionId",
        label: "Starting Level 0 Champion",
        kind: "card-reference" as const,
        required: true,
        sourceSectionId: "material" as const,
      },
      ...(id === "pantheon"
        ? [
            {
              id: "lesserBoonId" as const,
              label: "Lesser Boon",
              kind: "card-reference" as const,
              required: true,
            },
            {
              id: "greaterBoonId" as const,
              label: "Greater Boon",
              kind: "card-reference" as const,
              required: true,
            },
          ]
        : []),
    ],
    ...(id === "pantheon"
      ? {
          appearanceFields: [
            {
              id: "pantheonBarrierPrintingId",
              label: "Pantheon Barrier",
              kind: "printing-reference" as const,
              required: false,
            },
          ],
        }
      : {}),
    sections: [
      {
        id: "main",
        label: "Main Deck",
        roles: ["validation", "runtime"] as const,
        required: true,
        minimumCards: id === "draft" ? 30 : 60,
      },
      {
        id: "material",
        label: "Material Deck",
        roles: ["validation", "runtime"] as const,
        required: true,
        ...(id === "pantheon" ? { minimumCards: 12 } : { maximumCards: id === "draft" ? 10 : 12 }),
      },
      ...(includesSideboard
        ? [
            {
              id: "sideboard" as const,
              label: "Sideboard",
              roles: ["validation", "runtime"] as const,
              required: false,
              ...(id === "standard" ? { maximumCards: 15 } : {}),
            },
          ]
        : []),
    ],
  } as const;
}

function validateGrandArchiveExtensions(
  document: DeckDocumentV2<"grand-archive">,
  options: { readonly validationMode: "draft" | "registration" },
): DeckDocumentDiagnostic[] {
  const diagnostics: DeckDocumentDiagnostic[] = [];
  if (options.validationMode === "registration") {
    const startingChampionId = document.declarations?.startingChampionId;
    if (typeof startingChampionId === "string") {
      const card = grandArchiveCardsByCanonicalId.get(startingChampionId);
      const face = card
        ? card.layout.kind === "single-faced"
          ? card.layout.face
          : card.layout.defaultFace
        : null;
      if (!face?.typeLine.types.includes("CHAMPION") || face.stats.level !== 0) {
        diagnostics.push({
          kind: "malformed",
          message: "Starting Champion must reference a registered level-0 Champion.",
          path: "declarations.startingChampionId",
        });
      }
    }
  }
  if (document.formatId === "pantheon") {
    const materialCount = (document.sections.material ?? []).reduce(
      (total, entry) => total + entry.card.quantity,
      0,
    );
    const greaterBoonId = document.declarations?.greaterBoonId;
    const greaterBoon =
      typeof greaterBoonId === "string" ? grandArchiveCardsByCanonicalId.get(greaterBoonId) : null;
    const materialMaximum = greaterBoon?.canonicalId === GREATER_BOON_OF_PROXIA_ID ? 15 : 12;
    if (materialCount > materialMaximum) {
      diagnostics.push({
        kind: "malformed",
        message: `Pantheon Material Deck may contain at most ${materialMaximum} cards with the declared Greater Boon; received ${materialCount}.`,
        path: "sections.material",
      });
    }
  }
  return diagnostics;
}
