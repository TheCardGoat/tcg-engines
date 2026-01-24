import type { ActionCard } from "@tcg/lorcana-types";

export const charge: ActionCard = {
  id: "a71",
  cardType: "action",
  name: "Charge!",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Chosen character gains Challenger +2 and Resist +2 this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
  cost: 2,
  cardNumber: 198,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "24beb0fe8c03ee0a1b7062c3babb64cb44f8dd73",
  },
  abilities: [
    {
      id: "a71-1",
      type: "action",
      effect: {
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
      text: "Chosen character gains Challenger +2 and Resist +2 this turn.",
    },
  ],
};
