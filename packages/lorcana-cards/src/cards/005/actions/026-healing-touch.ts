import type { ActionCard } from "@tcg/lorcana-types";

export const healingTouch: ActionCard = {
  id: "9qq",
  cardType: "action",
  name: "Healing Touch",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "005",
  text: "Remove up to 4 damage from chosen character. Draw a card.",
  cost: 3,
  cardNumber: 26,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "231ce73a39f2059eb63484bf1ded08a47f4ed94a",
  },
  abilities: [
    {
      id: "9qq-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: 4,
            upTo: true,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Remove up to 4 damage from chosen character. Draw a card.",
    },
  ],
};
