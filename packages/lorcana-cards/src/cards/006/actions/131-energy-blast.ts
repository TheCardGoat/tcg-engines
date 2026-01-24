import type { ActionCard } from "@tcg/lorcana-types";

export const energyBlast: ActionCard = {
  id: "1j8",
  cardType: "action",
  name: "Energy Blast",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "Banish chosen character. Draw a card.",
  cost: 7,
  cardNumber: 131,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c679d181159ab4450f19fa0e4f60c90439382f17",
  },
  abilities: [
    {
      id: "1j8-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Banish chosen character. Draw a card.",
    },
  ],
};
