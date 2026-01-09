import type { ItemCard } from "@tcg/lorcana-types";

export const ursulaundefined: ItemCard = {
  id: "fkd",
  cardType: "item",
  name: "Ursula",
  version: "undefined",
  fullName: "Ursula - undefined",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**PEER INTO THE DEPTHS** {E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  cost: 2,
  cardNumber: 67,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "activated",
      name: "PEER INTO THE DEPTHS",
      text: "**PEER INTO THE DEPTHS** {E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      id: "fkd-1",
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
    },
  ],
};
