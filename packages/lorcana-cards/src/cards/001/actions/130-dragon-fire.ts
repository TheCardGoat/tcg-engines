import type { ActionCard } from "@tcg/lorcana-types";

export const dragonFireundefined: ActionCard = {
  id: "buy",
  cardType: "action",
  name: "Dragon Fire",
  version: "undefined",
  fullName: "Dragon Fire - undefined",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "Banish chosen character.",
  cost: 5,
  cardNumber: 130,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "buy-1",
      text: "Banish chosen character.",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
};
