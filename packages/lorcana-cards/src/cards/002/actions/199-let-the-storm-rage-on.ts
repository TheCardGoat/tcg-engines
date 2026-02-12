import type { ActionCard } from "@tcg/lorcana-types";

export const letTheStormRageOn: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "deal-damage",
            amount: 2,
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
        type: "sequence",
      },
      id: "16u-1",
      text: "Deal 2 damage to chosen character. Draw a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 199,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "9a63024ffea386ae54e4ff912373a8ea18fb0eed",
  },
  franchise: "Frozen",
  id: "16u",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Let the Storm Rage On",
  set: "002",
  text: "Deal 2 damage to chosen character. Draw a card.",
};
