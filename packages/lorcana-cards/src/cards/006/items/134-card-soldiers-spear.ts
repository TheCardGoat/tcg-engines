import type { ItemCard } from "@tcg/lorcana-types";

export const cardSoldiersSpear: ItemCard = {
  id: "1ul",
  cardType: "item",
  name: "Card Soldier's Spear",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "A SUITABLE WEAPON Your damaged characters get +1 {S}.",
  cost: 1,
  cardNumber: 134,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ee955829a8966f3315097e2637aafd172c098344",
  },
  abilities: [
    {
      id: "1ul-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      name: "A SUITABLE WEAPON Your damaged",
      text: "A SUITABLE WEAPON Your damaged characters get +1 {S}.",
    },
  ],
};
