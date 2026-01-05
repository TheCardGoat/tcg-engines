import { allCards } from "@tcg/lorcana-cards/cards";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  const cardsWithImageInfo = allCards.map((card) => {
    // Use the card's set and cardNumber directly, or fall back to first printing if available
    let set = card.set || "set1";
    let number = card.cardNumber || 1;

    // If card has multiple printings, use the first one
    if (card.printings && card.printings.length > 0) {
      const firstPrinting = card.printings[0];
      set = firstPrinting.set || set;
      number = firstPrinting.collectorNumber || number;
    }

    return {
      ...card,
      paramSet: set,
      paramNumber: number,
    };
  });

  return {
    cards: cardsWithImageInfo,
  };
};
