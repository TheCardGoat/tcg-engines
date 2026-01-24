import type { ActionCard } from "@tcg/lorcana-types";

export const legendOfTheSwordInTheStone: ActionCard = {
  id: "t20",
  cardType: "action",
  name: "Legend of the Sword in the Stone",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 64,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "68b837d1794b4887d94e74205c81d1741976d19c",
  },
  abilities: [
    {
      id: "t20-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 3,
        duration: "this-turn",
      },
      text: "Chosen character gains Challenger +3 this turn.",
    },
  ],
};
