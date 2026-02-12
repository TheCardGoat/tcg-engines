import type { ActionCard } from "@tcg/lorcana-types";

export const mosquitoBite: ActionCard = {
  abilities: [
    {
      effect: {
        type: "put-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1xn-1",
      text: "Put 1 damage counter on chosen character.",
      type: "action",
    },
  ],
  cardNumber: 96,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "fa00070954fa24098d79edb1d418f0e85d50bfc4",
  },
  franchise: "Lilo and Stitch",
  id: "1xn",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Mosquito Bite",
  set: "006",
  text: "Put 1 damage counter on chosen character.",
};
