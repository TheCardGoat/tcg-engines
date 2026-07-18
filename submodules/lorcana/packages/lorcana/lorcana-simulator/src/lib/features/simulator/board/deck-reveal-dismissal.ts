export type DeckRevealPosition = "top" | "bottom";

export type DeckRevealDismissals = Partial<Record<DeckRevealPosition, string>>;

export function isDeckRevealDismissed(
  dismissals: DeckRevealDismissals,
  position: DeckRevealPosition,
  cardId: string | null | undefined,
): boolean {
  return Boolean(cardId && dismissals[position] === cardId);
}

export function dismissDeckReveal(
  dismissals: DeckRevealDismissals,
  position: DeckRevealPosition,
  cardId: string,
): DeckRevealDismissals {
  return { ...dismissals, [position]: cardId };
}
