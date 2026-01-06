import type { ItemCard } from "@tcg/lorcana-types/cards/card-types";

export const dinglehopper: ItemCard = {
  id: "qef",
  cardType: "item",
  name: "Dinglehopper",
  version: "",
  fullName: "Dinglehopper",
  inkType: [
    "amber",
  ],
  franchise: "General",
  set: "001",
  text: "**STRAIGHTEN HAIR** {E} - Remove up to 1 damage from chosen character.",
  cost: 1,
  cardNumber: 32,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 492733,
  },
  abilities: [
    {
      type: "activated",
      cost: {
          exert: true,
        },
      effect: {
          type: "remove-damage",
          amount: 1,
          upTo: true,
          target: "CHOSEN_CHARACTER",
        },
      name: "Straighten Hair",
      id: "qef-1",
      text: "{E} - Remove up to 1 damage from chosen character.",
    },
  ],
};
