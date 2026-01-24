import type { ActionCard } from "@tcg/lorcana-types";

export const duckForCover: ActionCard = {
  id: "13l",
  cardType: "action",
  name: "Duck for Cover!",
  inkType: ["steel"],
  set: "005",
  text: "Chosen character gains Resist +1 and Evasive this turn. (Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)",
  cost: 2,
  cardNumber: 198,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8ec09ec81b578d2b3836f585a32e058381fe846c",
  },
  abilities: [
    {
      id: "13l-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 1,
        duration: "this-turn",
      },
      text: "Chosen character gains Resist +1 and Evasive this turn.",
    },
  ],
};
