import type { ActionCard } from "@tcg/lorcana-types";

export const hypnoticStrength: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
            value: 2,
          },
        ],
        type: "sequence",
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
