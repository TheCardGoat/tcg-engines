import type { ItemCard } from "@tcg/lorcana-types";

export const ratigansMarvelousTrap: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 2,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1wo-1",
      text: "SNAP! BOOM! TWANG! Banish this item — Each opponent loses 2 lore.",
      type: "activated",
    },
  ],
  cardNumber: 102,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "f7d80a26f58d881fa3db9124289c55a934cd1782",
  },
  franchise: "Great Mouse Detective",
  id: "1wo",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Ratigan's Marvelous Trap",
  set: "002",
  text: "SNAP! BOOM! TWANG! Banish this item — Each opponent loses 2 lore.",
};
