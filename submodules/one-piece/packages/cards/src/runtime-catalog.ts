import type { OPCard } from "@tcg/op-types";

const runtimeCards = new Map<string, OPCard>();

export function registerCards(cards: Iterable<OPCard>): void {
  for (const card of cards) {
    runtimeCards.set(card.id, card);
  }
}

export function getCard(id: string): OPCard {
  const card = runtimeCards.get(id);

  if (!card) {
    throw new Error(`Unknown One Piece card: ${id}`);
  }

  return card;
}

export function hasCard(id: string): boolean {
  return runtimeCards.has(id);
}
