import type { ActionCard } from "@tcg/lorcana-types";

export const duckForCover: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "13l-1",
      text: "Chosen character gains Resist +1 and Evasive this turn.",
      type: "action",
    },
  ],
  cardNumber: 198,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "8ec09ec81b578d2b3836f585a32e058381fe846c",
  },
  id: "13l",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Duck for Cover!",
  set: "005",
  text: "Chosen character gains Resist +1 and Evasive this turn. (Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)",
};
