import type { ItemCard } from "@tcg/lorcana-types";

export const ursulasCauldron: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        steps: [
          {
            type: "scry",
            amount: 2,
            target: "CONTROLLER",
            destinations: [
              {
                zone: "deck-bottom",
                remainder: true,
                ordering: "player-choice",
              },
            ],
          },
          {
            type: "put-on-bottom",
            target: "CHOSEN_CHARACTER",
          },
        ],
        type: "sequence",
      },
      id: "1ad-1",
      text: "PEER INTO THE DEPTHS {E} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      type: "activated",
    },
  ],
  cardNumber: 67,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "a757b4be52f0de48fe6589a497c72522ca4489c8",
  },
  franchise: "Little Mermaid",
  id: "1ad",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Ursula’s Cauldron",
  set: "001",
  text: "PEER INTO THE DEPTHS {E} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
};
