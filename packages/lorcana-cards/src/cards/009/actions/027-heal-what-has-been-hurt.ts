import type { ActionCard } from "@tcg/lorcana-types";

export const healWhatHasBeenHurt: ActionCard = {
  abilities: [
    {
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
      id: "1mx-1",
      text: "Remove up to 3 damage from chosen character. Draw a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 27,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "d45af62e889fec250e32e95abea7832ebf5ac8c3",
  },
  franchise: "Tangled",
  id: "1mx",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Heal What Has Been Hurt",
  set: "009",
  text: "Remove up to 3 damage from chosen character. Draw a card.",
};
