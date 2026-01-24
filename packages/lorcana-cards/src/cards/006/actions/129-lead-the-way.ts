import type { ActionCard } from "@tcg/lorcana-types";

export const leadTheWay: ActionCard = {
  id: "3ig",
  cardType: "action",
  name: "Lead the Way",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "Your characters get +2 {S} this turn.",
  cost: 2,
  cardNumber: 129,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0ca93cf0ba4a13734a84c1f1e6f1cd64cf55eece",
  },
  abilities: [
    {
      id: "3ig-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "Your characters get +2 {S} this turn.",
    },
  ],
};
