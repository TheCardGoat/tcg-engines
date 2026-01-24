import type { ItemCard } from "@tcg/lorcana-types";

export const maleficentsStaff: ItemCard = {
  id: "1uj",
  cardType: "item",
  name: "Maleficent's Staff",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "006",
  text: "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
  cost: 2,
  cardNumber: 65,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f0af7b77ab79602de64eaa232f48153d20f4cada",
  },
  abilities: [
    {
      id: "1uj-1",
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
    },
  ],
};
