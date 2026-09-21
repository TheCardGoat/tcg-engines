import type { OPCard } from "@tcg/op-types";
import { legacyPrintingIdAliases } from "./legacy-printing-id-aliases.generated.ts";

const runtimeCards = new Map<string, OPCard>();
// Printing ids resolve to the card they print (rules 2-14 / 5-1-2-3: a card
// number identifies one card). Definition ids take precedence.
const printingAliases = new Map<string, OPCard>();

export function registerCards(cards: Iterable<OPCard>): void {
  for (const card of cards) {
    runtimeCards.set(card.id, card);
  }
  for (const card of cards) {
    for (const printing of card.printings) {
      if (!runtimeCards.has(printing.id)) {
        printingAliases.set(printing.id, card);
      }
    }
  }
  // Ids authored before the canonical-card consolidation resolve to the
  // canonical card that owned them.
  for (const [legacyId, canonicalId] of Object.entries(legacyPrintingIdAliases)) {
    const card = runtimeCards.get(canonicalId);
    if (card && !runtimeCards.has(legacyId) && !printingAliases.has(legacyId)) {
      printingAliases.set(legacyId, card);
    }
  }
}

export function getCard(id: string): OPCard {
  const card = runtimeCards.get(id) ?? printingAliases.get(id);

  if (!card) {
    throw new Error(`Unknown One Piece card: ${id}`);
  }

  return card;
}

export function hasCard(id: string): boolean {
  return runtimeCards.has(id) || printingAliases.has(id);
}
