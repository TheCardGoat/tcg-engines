import type { ActionCard } from "@tcg/lorcana-types";

export const undermine: ActionCard = {
  abilities: [
    {
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
      id: "z6k-1",
      text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 117,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "7ecd02fc2b52fa45baec4adfd9a638d543b1d8de",
  },
  franchise: "Atlantis",
  id: "z6k",
  inkType: ["emerald", "ruby"],
  inkable: true,
  missingTests: true,
  name: "Undermine",
  set: "008",
  text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
};
