import type { ItemCard } from "@tcg/lorcana-types";

export const iceBlock: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
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
      id: "ssh-1",
      text: "CHILLY LABOR {E} — Chosen character gets -1 {S} this turn.",
      type: "activated",
    },
  ],
  cardNumber: 168,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "67c3a9d35138ced621a95e5ffb3c11d66ec99f27",
  },
  franchise: "Frozen",
  id: "ssh",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Ice Block",
  set: "004",
  text: "CHILLY LABOR {E} — Chosen character gets -1 {S} this turn.",
};
