import { cardsAuxKv, printings } from "@tcg/lorcana-cards/data";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";

export type LorcanaCardsById = Record<string, LorcanaCardDefinition>;

let currentShortIdByLegacyGameCardId: Map<string, string> | null = null;

function getCurrentShortIdByLegacyGameCardId(): Map<string, string> {
  if (currentShortIdByLegacyGameCardId) {
    return currentShortIdByLegacyGameCardId;
  }

  const byLegacyId = new Map<string, string>();
  for (const printing of Object.values(printings)) {
    const currentShortId = cardsAuxKv.printingIdToShortId[printing.id];
    if (currentShortId && currentShortId !== printing.gameCardId) {
      byLegacyId.set(printing.gameCardId, currentShortId);
    }
  }

  currentShortIdByLegacyGameCardId = byLegacyId;
  return byLegacyId;
}

export function resolveDeckCardPublicId(publicId: string, cardsById: LorcanaCardsById): string {
  if (cardsById[publicId]) {
    return publicId;
  }

  const currentShortId = getCurrentShortIdByLegacyGameCardId().get(publicId);
  if (currentShortId && cardsById[currentShortId]) {
    return currentShortId;
  }

  return publicId;
}

export function getDeckCardByPublicId(
  publicId: string,
  cardsById: LorcanaCardsById,
): LorcanaCardDefinition | undefined {
  return cardsById[resolveDeckCardPublicId(publicId, cardsById)];
}
