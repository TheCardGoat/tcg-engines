import type { ActionCard } from "@tcg/lorcana-types";

export const distract: ActionCard = {
  id: "1un",
  cardType: "action",
  name: "Distract",
  inkType: ["sapphire"],
  set: "003",
  text: "Chosen character gets -2 {S} this turn. Draw a card.",
  cost: 2,
  cardNumber: 159,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "efed43f00fc8ef2ffa9a90270aa7a41a14b24f8c",
  },
  abilities: [
    {
      id: "1un-1",
      type: "action",
      effect: {
        type: "sequence",
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
      },
      text: "Chosen character gets -2 {S} this turn. Draw a card.",
    },
  ],
};
