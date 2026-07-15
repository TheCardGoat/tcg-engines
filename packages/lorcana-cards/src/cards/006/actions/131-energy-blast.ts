import type { ActionCard } from "@tcg/lorcana-types";

export const energyBlast: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "banish",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "1j8-1",
      text: "Banish chosen character. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 131,
  cardType: "action",
  cost: 7,
  externalIds: {
    ravensburger: "c679d181159ab4450f19fa0e4f60c90439382f17",
  },
  franchise: "Aladdin",
  id: "1j8",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "Energy Blast",
  set: "006",
  text: "Banish chosen character. Draw a card.",
};
