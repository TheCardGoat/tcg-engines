import type { ItemCard } from "@tcg/lorcana-types/cards/card-types";

export const magicGoldenFlower: ItemCard = {
  id: "foq",
  cardType: "item",
  name: "Magic Golden Flower",
  version: "",
  fullName: "Magic Golden Flower",
  inkType: ["sapphire"],
  franchise: "General",
  set: "001",
  text: "**HEALING POLLEN** Banish this item - Remove up to 3 damage from chosen character.",
  cost: 1,
  cardNumber: 169,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508860,
  },
  abilities: [
    {
      type: "activated",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: "CHOSEN_CHARACTER",
      },
      name: "Healing Pollen",
      id: "foq-1",
      text: "Banish this item - Remove up to 3 damage from chosen character.",
    },
  ],
};
