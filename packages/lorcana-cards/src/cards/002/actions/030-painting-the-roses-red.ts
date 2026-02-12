import type { ActionCard } from "@tcg/lorcana-types";

export const paintingTheRosesRed: ActionCard = {
  abilities: [
    {
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
      id: "2ft-1",
      text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
      type: "static",
    },
  ],
  actionSubtype: "song",
  cardNumber: 30,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "003e83f940426d943bddbae6a42d20fe26abf042",
  },
  franchise: "Alice in Wonderland",
  id: "2ft",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Painting the Roses Red",
  set: "002",
  text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
};
