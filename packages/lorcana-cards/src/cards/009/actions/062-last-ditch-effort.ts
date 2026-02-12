import type { ActionCard } from "@tcg/lorcana-types";

export const lastditchEffort: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "opponent",
              selector: "chosen",
              zones: ["play"],
            },
            type: "exert",
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
      id: "1lj-1",
      text: "Exert chosen opposing character. Chosen character of yours gains Challenger +2 this turn.",
      type: "action",
    },
  ],
  cardNumber: 62,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "cf37b6d51b29ef3781307521b75714776bf0549a",
  },
  franchise: "Moana",
  id: "1lj",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Last-Ditch Effort",
  set: "009",
  text: "Exert chosen opposing character. Chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
};
