import type { ActionCard } from "@tcg/lorcana-types";

export const paintingTheRosesRed: ActionCard = {
  id: "2ft",
  cardType: "action",
  name: "Painting the Roses Red",
  inkType: ["amber"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 30,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "003e83f940426d943bddbae6a42d20fe26abf042",
  },
  abilities: [
    {
      id: "2ft-1",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -1,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            duration: "this-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
    },
  ],
};
