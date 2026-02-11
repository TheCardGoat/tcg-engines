import type { ItemCard } from "@tcg/lorcana-types";

export const ursulasCauldron: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "scry",
        amount: 2,
        destinations: [
          { zone: "deck-top", min: 1, max: 1 },
          { zone: "deck-bottom", remainder: true },
        ],
      },
      id: "fkd-1",
      name: "PEER INTO THE DEPTHS",
      text: "**PEER INTO THE DEPTHS** {E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      type: "activated",
    },
  ],
  cardNumber: 67,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Ursula's Cauldron",
  id: "fkd",
  inkType: ["amethyst"],
  inkable: true,
  name: "Ursula's Cauldron",
  set: "001",
  text: "**PEER INTO THE DEPTHS** {E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  version: "",
};
