import type { ActionCard } from "@tcg/lorcana-types";

export const makingMagic: ActionCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      id: "1ci-1",
      text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 62,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "adf1058d9209d88466a9f74d83dec159dad4d15a",
  },
  franchise: "Princess and the Frog",
  id: "1ci",
  inkType: ["amethyst"],
  inkable: true,
  name: "Making Magic",
  set: "006",
  text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
};
