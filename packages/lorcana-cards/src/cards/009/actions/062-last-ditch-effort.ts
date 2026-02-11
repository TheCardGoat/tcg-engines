import type { ActionCard } from "@tcg/lorcana-types";

export const lastditchEffort: ActionCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
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
