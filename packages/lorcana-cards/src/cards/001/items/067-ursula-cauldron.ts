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
      type: "action",
      text: "**PEER INTO THE DEPTHS** {E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      id: "fkd-1",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look-at-cards",
            amount: 2,
            from: "top-of-deck",
            target: "CONTROLLER",
          },
          {
            type: "put-on-bottom",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    },
  ],
};
