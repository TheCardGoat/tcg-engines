import type { ActionCard } from "@tcg/lorcana-types";

export const lastditchEffort: ActionCard = {
  id: "1lj",
  cardType: "action",
  name: "Last-Ditch Effort",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "009",
  text: "Exert chosen opposing character. Chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 3,
  cardNumber: 62,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "cf37b6d51b29ef3781307521b75714776bf0549a",
  },
  abilities: [
    {
      id: "1lj-1",
      type: "action",
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
      text: "Exert chosen opposing character. Chosen character of yours gains Challenger +2 this turn.",
    },
  ],
};
