import type { ActionCard } from "@tcg/lorcana-types";

export const makingMagic: ActionCard = {
  id: "1ci",
  cardType: "action",
  name: "Making Magic",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "006",
  text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
  cost: 3,
  cardNumber: 62,
  inkable: true,
  externalIds: {
    ravensburger: "adf1058d9209d88466a9f74d83dec159dad4d15a",
  },
  abilities: [
    {
      id: "1ci-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
    },
  ],
};
