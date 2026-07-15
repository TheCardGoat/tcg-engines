import type { ActionCard } from "@tcg/lorcana-types";

export const searchForClues: ActionCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a Detective character in play",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "167-1",
      text: "The player or players with the most cards in their hands choose and discard 2 cards. If you have a Detective character in play, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 26,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "9a4aae2e38a1d62d48a0e1a6e6e406b746b71b95",
  },
  franchise: "Zootropolis",
  id: "167",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Search for Clues",
  set: "010",
  text: "The player or players with the most cards in their hands choose and discard 2 cards. If you have a Detective character in play, gain 1 lore.",
};
