import type { ActionCard } from "@tcg/lorcana-types";

export const swingIntoAction: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "r30-1",
      text: "Chosen character gains Rush this turn.",
      type: "action",
    },
  ],
  cardNumber: 62,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "619c55ff131a58ac8714449f5ee1788379659e58",
  },
  franchise: "Encanto",
  id: "r30",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Swing into Action",
  set: "004",
  text: "Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
};
