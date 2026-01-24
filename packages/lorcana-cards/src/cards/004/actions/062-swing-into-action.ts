import type { ActionCard } from "@tcg/lorcana-types";

export const swingIntoAction: ActionCard = {
  id: "r30",
  cardType: "action",
  name: "Swing into Action",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  text: "Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 1,
  cardNumber: 62,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "619c55ff131a58ac8714449f5ee1788379659e58",
  },
  abilities: [
    {
      id: "r30-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "Chosen character gains Rush this turn.",
    },
  ],
};
