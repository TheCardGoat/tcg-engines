import type { ActionCard } from "@tcg/lorcana-types";

export const paintingTheRosesRed: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: -1,
            stat: "strength",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "modify-stat",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
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
