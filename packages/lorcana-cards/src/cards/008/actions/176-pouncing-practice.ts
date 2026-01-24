import type { ActionCard } from "@tcg/lorcana-types";

export const pouncingPractice: ActionCard = {
  id: "59j",
  cardType: "action",
  name: "Pouncing Practice",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "008",
  text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn. (They can challenge characters with Evasive.)",
  cost: 2,
  cardNumber: 176,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "12f96e5edbcf8a1a75344eb8f5097aaec5b6c67a",
  },
  abilities: [
    {
      id: "59j-1",
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
            type: "gain-keyword",
            keyword: "Evasive",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            duration: "this-turn",
          },
        ],
      },
      text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
    },
  ],
};
