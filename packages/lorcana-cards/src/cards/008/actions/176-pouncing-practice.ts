import type { ActionCard } from "@tcg/lorcana-types";

export const pouncingPractice: ActionCard = {
  abilities: [
    {
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
      id: "59j-1",
      text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
      type: "action",
    },
  ],
  cardNumber: 176,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "12f96e5edbcf8a1a75344eb8f5097aaec5b6c67a",
  },
  franchise: "Lion King",
  id: "59j",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Pouncing Practice",
  set: "008",
  text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn. (They can challenge characters with Evasive.)",
};
