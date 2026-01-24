import type { ItemCard } from "@tcg/lorcana-types";

export const iceBlock: ItemCard = {
  id: "ssh",
  cardType: "item",
  name: "Ice Block",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  text: "CHILLY LABOR {E} — Chosen character gets -1 {S} this turn.",
  cost: 1,
  cardNumber: 168,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "67c3a9d35138ced621a95e5ffb3c11d66ec99f27",
  },
  abilities: [
    {
      id: "ssh-1",
      type: "activated",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "CHILLY LABOR {E} — Chosen character gets -1 {S} this turn.",
    },
  ],
};
