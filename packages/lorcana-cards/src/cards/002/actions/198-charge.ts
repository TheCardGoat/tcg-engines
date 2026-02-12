import type { ActionCard } from "@tcg/lorcana-types";

export const charge: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "a71-1",
      text: "Chosen character gains Challenger +2 and Resist +2 this turn.",
      type: "action",
    },
  ],
  cardNumber: 198,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "24beb0fe8c03ee0a1b7062c3babb64cb44f8dd73",
  },
  franchise: "Raya and the Last Dragon",
  id: "a71",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Charge!",
  set: "002",
  text: "Chosen character gains Challenger +2 and Resist +2 this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
};
