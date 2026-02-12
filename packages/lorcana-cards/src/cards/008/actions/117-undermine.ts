import type { ActionCard } from "@tcg/lorcana-types";

export const undermine: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            chosen: true,
            target: "CONTROLLER",
            type: "discard",
          },
          {
            duration: "this-turn",
            modifier: 2,
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
        ],
        type: "sequence",
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
