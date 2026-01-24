import type { ActionCard } from "@tcg/lorcana-types";

export const improvise: ActionCard = {
  id: "gai",
  cardType: "action",
  name: "Improvise",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "009",
  text: "Chosen character gets +1 {S} this turn. Draw a card.",
  cost: 1,
  cardNumber: 96,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3ab79a09520ac3d506965f3d02a348a861f725c5",
  },
  abilities: [
    {
      id: "gai-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
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
      text: "Chosen character gets +1 {S} this turn. Draw a card.",
    },
  ],
};
