import type { ActionCard } from "@tcg/lorcana-types";

export const distract: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            duration: "this-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
        type: "sequence",
      },
      id: "1un-1",
      text: "Chosen character gets -2 {S} this turn. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 159,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "efed43f00fc8ef2ffa9a90270aa7a41a14b24f8c",
  },
  id: "1un",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Distract",
  set: "003",
  text: "Chosen character gets -2 {S} this turn. Draw a card.",
};
