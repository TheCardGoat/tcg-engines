import type { ActionCard } from "@tcg/lorcana-types";

export const theBossIsOnARoll: ActionCard = {
  abilities: [
    {
      effect: {
        optionLabels: [
          "Look at the top 5 cards of your deck. Put any number of them on the top",
          "the bottom of your deck in any order. Gain 1 lore.",
        ],
        options: [
          {
            amount: 5,
            destinations: [
              {
                ordering: "player-choice",
                remainder: true,
                zone: "deck-bottom",
              },
            ],
            target: "CONTROLLER",
            type: "scry",
          },
          {
            amount: 1,
            type: "gain-lore",
          },
        ],
        type: "choice",
      },
      id: "18j-1",
      text: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 63,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "9ff06b2f3d099b1b25c66e78bb07316465d065f7",
  },
  franchise: "Little Mermaid",
  id: "18j",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "The Boss is on a Roll",
  set: "003",
  text: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
};
