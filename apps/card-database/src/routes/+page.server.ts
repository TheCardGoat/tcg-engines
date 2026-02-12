import { getAllCards } from "@tcg/lorcana-cards/cards";
import type { LorcanaCard } from "@tcg/lorcana-types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const allCards = await getAllCards();
  const cardsWithImageInfo = allCards.map((card: LorcanaCard) => {
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
      paramNumber: number,
      paramSet: set,
    };
  });

  return {
    cards: cardsWithImageInfo,
  };
};
