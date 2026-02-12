import type { ActionCard } from "@tcg/lorcana-types";

export const improvise: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: 1,
            stat: "strength",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
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
