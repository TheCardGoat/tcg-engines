import type { ActionCard } from "@tcg/lorcana-types";

export const healingTouch: ActionCard = {
  abilities: [
    {
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
      id: "9qq-1",
      text: "Remove up to 4 damage from chosen character. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 26,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "231ce73a39f2059eb63484bf1ded08a47f4ed94a",
  },
  franchise: "Frozen",
  id: "9qq",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Healing Touch",
  set: "005",
  text: "Remove up to 4 damage from chosen character. Draw a card.",
};
