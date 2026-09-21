import type { DeckDocument } from "@tcg/game-page-contract/deck-document";
import { getGrandArchiveCard, grandArchiveCatalogIndex } from "@tcg/grand-archive-cards";
import { grandArchiveDeckInterchangeAdapter } from "./deck-interchange.ts";

/** Catalog identity stays game-owned; platform never needs the native card model. */
export const grandArchiveDeckIdentity = {
  normalizeInputCardId(cardId: string): { canonicalId: string; printingId: string } | null {
    const card = getGrandArchiveCard(cardId);
    const printing =
      card?.printings.find((candidate) => candidate.id === cardId) ?? card?.printings[0];
    return card && printing ? { canonicalId: card.canonicalId, printingId: printing.id } : null;
  },
  resolvePrintingId(printingId: string): { canonicalId: string } | null {
    const card = grandArchiveCatalogIndex.cardsByPrintingId.get(printingId);
    return card ? { canonicalId: card.canonicalId } : null;
  },
  defaultPrintingId(canonicalId: string): string | null {
    return grandArchiveCatalogIndex.cardsByCanonicalId.get(canonicalId)?.printings[0]?.id ?? null;
  },
  projectToEngineCardId(entry: { canonicalId: string; printingId: string }): string {
    return entry.canonicalId;
  },
};

export function grandArchiveDeckCardPresentation(canonicalId: string, printingId: string) {
  const card = grandArchiveCatalogIndex.cardsByCanonicalId.get(canonicalId);
  const printing = card?.printings.find((candidate) => candidate.id === printingId);
  if (!card || !printing) return null;
  return {
    publicId: card.slug,
    name: card.name,
    type: card.types.join(" "),
    colors: [...card.elements],
    ...(printing.imageUrl ? { imageUrl: printing.imageUrl } : {}),
    detailUrl: null,
  };
}

export interface GrandArchiveDeckCardInput {
  cardId: string;
  quantity: number;
}

export interface GrandArchivePlatformDeckInput {
  mainDeck: readonly GrandArchiveDeckCardInput[];
  materialDeck: readonly GrandArchiveDeckCardInput[];
  sideboard: readonly GrandArchiveDeckCardInput[];
  startingChampionId?: string | null;
}

export class GrandArchiveDeckInputError extends Error {}

/** Save drafts without claiming registration legality; the adapter validates at play time. */
export function prepareGrandArchivePlatformDeck(input: GrandArchivePlatformDeckInput) {
  const normalizeSection = (entries: readonly GrandArchiveDeckCardInput[]) => {
    const byPrinting = new Map<
      string,
      { canonicalId: string; printingId: string; quantity: number }
    >();
    for (const entry of entries) {
      if (!Number.isSafeInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > 999) {
        throw new GrandArchiveDeckInputError("Card quantity must be an integer between 1 and 999");
      }
      const identity = grandArchiveDeckIdentity.normalizeInputCardId(entry.cardId);
      if (!identity)
        throw new GrandArchiveDeckInputError(`Unknown Grand Archive card: ${entry.cardId}`);
      const quantity = (byPrinting.get(identity.printingId)?.quantity ?? 0) + entry.quantity;
      if (quantity > 999) throw new GrandArchiveDeckInputError("Card quantity cannot exceed 999");
      byPrinting.set(identity.printingId, { ...identity, quantity });
    }
    return [...byPrinting.values()].sort((a, b) => a.printingId.localeCompare(b.printingId));
  };
  const sections = {
    main: normalizeSection(input.mainDeck),
    material: normalizeSection(input.materialDeck),
    sideboard: normalizeSection(input.sideboard),
  };
  const champion = input.startingChampionId ? getGrandArchiveCard(input.startingChampionId) : null;
  if (
    input.startingChampionId &&
    (!champion ||
      champion.level !== 0 ||
      !champion.types.includes("CHAMPION") ||
      !sections.material.some((entry) => entry.canonicalId === champion.canonicalId))
  ) {
    throw new GrandArchiveDeckInputError(
      "Starting Champion must be a level-0 Champion in the Material Deck",
    );
  }
  const document = grandArchiveDeckInterchangeAdapter.createDocument({
    formatId: "standard",
    sections,
    ...(champion ? { declarations: { startingChampionId: champion.canonicalId } } : {}),
  });
  const identityEntries = Object.entries(sections).flatMap(([sectionId, entries]) => {
    const byCanonical = new Map<string, number>();
    for (const entry of entries) {
      byCanonical.set(
        entry.canonicalId,
        (byCanonical.get(entry.canonicalId) ?? 0) + entry.quantity,
      );
    }
    return [...byCanonical].map(([canonicalId, quantity]) => ({
      cardId: canonicalId,
      canonicalId,
      quantity,
      sectionId,
    }));
  });
  return { document, identityEntries };
}

export { grandArchiveDeckInterchangeAdapter };

/** Public catalog projection: no engine definitions, executable effects, or HTML. */
export function getGrandArchiveDeckBuilderCatalog() {
  return {
    game: "grand-archive" as const,
    cards: [...grandArchiveCatalogIndex.cardsByCanonicalId.values()].map((card) => ({
      canonicalId: card.canonicalId,
      slug: card.slug,
      name: card.name,
      types: [...card.types],
      elements: [...card.elements],
      classes: [...card.classes],
      subtypes: [...card.subtypes],
      memoryCost: card.memoryCost,
      reserveCost: card.reserveCost,
      level: card.level,
      power: card.power,
      life: card.life,
      durability: card.durability,
      rulesText: card.effectRaw ?? "",
      printings: card.printings.map((printing) => ({
        id: printing.id,
        imageUrl: printing.imageUrl ?? null,
        setName: printing.set.name,
        setCode: printing.setCode,
        collectorNumber: printing.collectorNumber,
        rarity: printing.rarity,
      })),
    })),
  };
}

/** Display only: selected setup card and section counts, without leaking native models. */
export function grandArchivePlatformSetupSummary(document: DeckDocument | null | undefined) {
  if (document?.game !== "grand-archive" || document.schemaVersion !== 2) return undefined;
  const sectionCardCounts = Object.fromEntries(
    Object.entries(document.sections).flatMap(([id, entries]) =>
      entries ? [[id, entries.reduce((sum, entry) => sum + entry.card.quantity, 0)] as const] : [],
    ),
  );
  const declared = document.declarations?.startingChampionId;
  const champion = typeof declared === "string" ? getGrandArchiveCard(declared) : null;
  const entry = champion
    ? document.sections.material?.find((entry) => entry.card.canonicalId === champion.canonicalId)
    : undefined;
  const printingId = entry?.appearance?.printingAllocations?.[0]?.printingId;
  const printing = printingId
    ? champion?.printings.find((printing) => printing.id === printingId)
    : champion?.printings[0];
  return {
    sectionCardCounts,
    setupCards:
      champion && entry
        ? [
            {
              slotId: "startingChampionId",
              canonicalId: champion.canonicalId,
              name: champion.name,
              imageUrl: printing?.imageUrl ?? null,
            },
          ]
        : [],
  };
}

/** Public views retain section and printing identity instead of reading legacy boards. */
export function grandArchivePublicDeckBoards(document: DeckDocument | null | undefined) {
  if (!document || document.game !== "grand-archive" || document.schemaVersion !== 2) {
    throw new GrandArchiveDeckInputError(
      "Grand Archive deck is missing its authoritative document",
    );
  }
  const section = (id: "main" | "material" | "sideboard") =>
    (document.sections[id] ?? []).flatMap((entry) => {
      const canonicalId = entry.card.canonicalId;
      const allocations = entry.appearance?.printingAllocations;
      const printings = allocations?.length
        ? allocations
        : [
            {
              printingId: grandArchiveDeckIdentity.defaultPrintingId(canonicalId),
              quantity: entry.card.quantity,
            },
          ];
      return printings.map(({ printingId, quantity }) => {
        const presentation = printingId
          ? grandArchiveDeckCardPresentation(canonicalId, printingId)
          : null;
        if (!printingId || !presentation) {
          throw new GrandArchiveDeckInputError(
            `Unknown Grand Archive card printing: ${canonicalId}`,
          );
        }
        return {
          canonicalId,
          printingId,
          quantity,
          name: presentation.name,
          type: presentation.type,
          imageUrl: presentation.imageUrl ?? null,
        };
      });
    });
  return {
    main: section("main"),
    material: section("material"),
    sideboard: section("sideboard"),
    startingChampionId:
      typeof document.declarations?.startingChampionId === "string"
        ? document.declarations.startingChampionId
        : null,
  };
}
