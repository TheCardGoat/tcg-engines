import type { LorcanaCard } from "@tcg/lorcana-types";

/**
 * Typed accessor for a Lorcana card definition by instance ID.
 */
export function getCardDefinition(
  ctx: { cards: { getDefinition: (cardId: string) => unknown } },
  cardId: string,
): LorcanaCard | undefined {
  return ctx.cards.getDefinition(cardId) as LorcanaCard | undefined;
}
