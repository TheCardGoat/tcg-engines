import type { ActionCard } from "@tcg/lorcana-types";

export const leadTheWay: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "3ig-1",
      text: "Your characters get +2 {S} this turn.",
      type: "static",
    },
  ],
  cardNumber: 129,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "0ca93cf0ba4a13734a84c1f1e6f1cd64cf55eece",
  },
  franchise: "Aladdin",
  id: "3ig",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Lead the Way",
  set: "006",
  text: "Your characters get +2 {S} this turn.",
};
