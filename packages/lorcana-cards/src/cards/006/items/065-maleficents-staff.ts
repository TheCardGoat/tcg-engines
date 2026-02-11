import type { ItemCard } from "@tcg/lorcana-types";

export const maleficentsStaff: ItemCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1uj-1",
      text: "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 65,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "f0af7b77ab79602de64eaa232f48153d20f4cada",
  },
  franchise: "Sleeping Beauty",
  id: "1uj",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Maleficent's Staff",
  set: "006",
  text: "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
};
