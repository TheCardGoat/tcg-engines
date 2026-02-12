import type { ItemCard } from "@tcg/lorcana-types";

export const cardSoldiersSpear: ItemCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "1ul-1",
      name: "A SUITABLE WEAPON Your damaged",
      text: "A SUITABLE WEAPON Your damaged characters get +1 {S}.",
      type: "static",
    },
  ],
  cardNumber: 134,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "ee955829a8966f3315097e2637aafd172c098344",
  },
  franchise: "Alice in Wonderland",
  id: "1ul",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Card Soldier's Spear",
  set: "006",
  text: "A SUITABLE WEAPON Your damaged characters get +1 {S}.",
};
