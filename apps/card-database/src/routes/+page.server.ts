import { allCanonicalCards, getPrinting } from "@tcg/lorcana-cards/data";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const cardsWithImageInfo = allCanonicalCards.map((card) => {
    // Use the first printing as the default for the image
    const defaultPrinting = card.printings[0] as
      | { set?: string; collectorNumber?: number }
      | string
      | undefined;

    let set = "set1";
    let number = 1;

    if (typeof defaultPrinting === "object" && defaultPrinting !== null) {
      // Handle object structure { set: "006", collectorNumber: 67, ... }
      set = defaultPrinting.set || "set1";
      number = defaultPrinting.collectorNumber || 1;
    } else if (typeof defaultPrinting === "string") {
      // Handle string ID lookup
      const printing = getPrinting(defaultPrinting);
      set = printing?.set ?? "set1";
      number = printing?.cardNumber ?? 1;
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
