import { getLorcanaShortIdResolution, resolveLorcanaDisplayShortId } from "@tcg/lorcana-cards/data";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";

export type LorcanaCardsById = Record<string, LorcanaCardDefinition>;

export function resolveDeckCardPublicId(publicId: string, cardsById: LorcanaCardsById): string {
  return resolveLorcanaDisplayShortId(publicId, (shortId) => Boolean(cardsById[shortId]));
}

export function getDeckCardByPublicId(
  publicId: string,
  cardsById: LorcanaCardsById,
): LorcanaCardDefinition | undefined {
  const resolution = getLorcanaShortIdResolution(publicId);
  if (resolution.kind === "ambiguous") {
    return undefined;
  }

  return cardsById[resolveDeckCardPublicId(publicId, cardsById)];
}
