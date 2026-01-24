import type { ActionCard } from "@tcg/lorcana-types";

export const theBossIsOnARoll: ActionCard = {
  id: "18j",
  cardType: "action",
  name: "The Boss is on a Roll",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "003",
  text: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 63,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9ff06b2f3d099b1b25c66e78bb07316465d065f7",
  },
  abilities: [
    {
      id: "18j-1",
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "scry",
            amount: 5,
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
            type: "gain-lore",
            amount: 1,
          },
        ],
        optionLabels: [
          "Look at the top 5 cards of your deck. Put any number of them on the top",
          "the bottom of your deck in any order. Gain 1 lore.",
        ],
      },
      text: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
    },
  ],
};
