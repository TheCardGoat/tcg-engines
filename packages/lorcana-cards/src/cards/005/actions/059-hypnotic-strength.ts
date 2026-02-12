import type { ActionCard } from "@tcg/lorcana-types";

export const hypnoticStrength: ActionCard = {
  abilities: [
    {
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
      id: "tu0-1",
      text: "Draw a card. Chosen character gains Challenger +2 this turn.",
      type: "action",
    },
  ],
  cardNumber: 59,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "02fc9a9247b0b6880e17a7e30bd4b6da98fd0d70",
  },
  franchise: "Aladdin",
  id: "tu0",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Hypnotic Strength",
  set: "005",
  text: "Draw a card. Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
};
