import type { ActionCard } from "@tcg/lorcana-types";

export const letTheStormRageOn: ActionCard = {
  id: "16u",
  cardType: "action",
  name: "Let the Storm Rage On",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "002",
  text: "Deal 2 damage to chosen character. Draw a card.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 199,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9a63024ffea386ae54e4ff912373a8ea18fb0eed",
  },
  abilities: [
    {
      id: "16u-1",
      type: "action",
      effect: {
        type: "sequence",
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
      },
      text: "Deal 2 damage to chosen character. Draw a card.",
    },
  ],
};
