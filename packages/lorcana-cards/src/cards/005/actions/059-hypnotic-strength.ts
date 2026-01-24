import type { ActionCard } from "@tcg/lorcana-types";

export const hypnoticStrength: ActionCard = {
  id: "tu0",
  cardType: "action",
  name: "Hypnotic Strength",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  text: "Draw a card. Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 2,
  cardNumber: 59,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "02fc9a9247b0b6880e17a7e30bd4b6da98fd0d70",
  },
  abilities: [
    {
      id: "tu0-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-keyword",
            keyword: "Challenger",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            value: 2,
            duration: "this-turn",
          },
        ],
      },
      text: "Draw a card. Chosen character gains Challenger +2 this turn.",
    },
  ],
};
