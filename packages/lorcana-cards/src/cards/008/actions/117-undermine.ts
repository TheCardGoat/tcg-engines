import type { ActionCard } from "@tcg/lorcana-types";

export const undermine: ActionCard = {
  id: "z6k",
  cardType: "action",
  name: "Undermine",
  inkType: ["emerald", "ruby"],
  franchise: "Atlantis",
  set: "008",
  text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
  cost: 2,
  cardNumber: 117,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7ecd02fc2b52fa45baec4adfd9a638d543b1d8de",
  },
  abilities: [
    {
      id: "z6k-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            duration: "this-turn",
          },
        ],
      },
      text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
    },
  ],
};
