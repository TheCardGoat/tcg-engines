import type { ActionCard } from "@tcg/lorcana-types";

export const improvise: ActionCard = {
  abilities: [
    {
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
      id: "gai-1",
      text: "Chosen character gets +1 {S} this turn. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 96,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "3ab79a09520ac3d506965f3d02a348a861f725c5",
  },
  franchise: "Mulan",
  id: "gai",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Improvise",
  set: "009",
  text: "Chosen character gets +1 {S} this turn. Draw a card.",
};
