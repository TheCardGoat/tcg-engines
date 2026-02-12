import type { ActionCard } from "@tcg/lorcana-types";

export const headsHeldHigh: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 3,
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "remove-damage",
            upTo: true,
          },
          {
            duration: "this-turn",
            modifier: -3,
            stat: "strength",
            target: "CHOSEN_CHARACTER",
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      id: "x39-1",
      text: "Sing Together 6 Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
      type: "static",
    },
  ],
  actionSubtype: "song",
  cardNumber: 175,
  cardType: "action",
  cost: 6,
  externalIds: {
    ravensburger: "7742f7b5a856d9e0d4a7cdca15498823c733e9d5",
  },
  franchise: "Rescuers",
  id: "x39",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Heads Held High",
  set: "008",
  text: "Sing Together 6 Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
};
