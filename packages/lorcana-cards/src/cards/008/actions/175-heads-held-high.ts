import type { ActionCard } from "@tcg/lorcana-types";

export const headsHeldHigh: ActionCard = {
  id: "x39",
  cardType: "action",
  name: "Heads Held High",
  inkType: ["sapphire"],
  franchise: "Rescuers",
  set: "008",
  text: "Sing Together 6 Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
  actionSubtype: "song",
  cost: 6,
  cardNumber: 175,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7742f7b5a856d9e0d4a7cdca15498823c733e9d5",
  },
  abilities: [
    {
      id: "x39-1",
      type: "static",
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
            type: "modify-stat",
            stat: "strength",
            modifier: -3,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        ],
      },
      text: "Sing Together 6 Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
    },
  ],
};
