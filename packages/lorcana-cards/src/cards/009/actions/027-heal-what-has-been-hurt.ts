import type { ActionCard } from "@tcg/lorcana-types";

export const healWhatHasBeenHurt: ActionCard = {
  id: "1mx",
  cardType: "action",
  name: "Heal What Has Been Hurt",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "009",
  text: "Remove up to 3 damage from chosen character. Draw a card.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 27,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d45af62e889fec250e32e95abea7832ebf5ac8c3",
  },
  abilities: [
    {
      id: "1mx-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: 3,
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
      text: "Remove up to 3 damage from chosen character. Draw a card.",
    },
  ],
};
