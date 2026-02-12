import type { ActionCard } from "@tcg/lorcana-types";

export const legendOfTheSwordInTheStone: ActionCard = {
  abilities: [
    {
      effect: {
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
        value: 3,
      },
      id: "t20-1",
      text: "Chosen character gains Challenger +3 this turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 64,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "68b837d1794b4887d94e74205c81d1741976d19c",
  },
  franchise: "Sword in the Stone",
  id: "t20",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Legend of the Sword in the Stone",
  set: "002",
  text: "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
};
