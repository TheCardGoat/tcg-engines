import type { ItemCard } from "@tcg/lorcana-types/cards/card-types";

export const swordOfTruth: ItemCard = {
  id: "jpg",
  cardType: "item",
  name: "Sword of Truth",
  version: "",
  fullName: "Sword of Truth",
  inkType: ["ruby"],
  franchise: "General",
  set: "001",
  text: "**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.",
  cost: 4,
  cardNumber: 136,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508793,
  },
  abilities: [
    {
      type: "activated",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
      name: "Final Enchantment",
      id: "jpg-1",
      text: "Banish this item − Banish chosen Villain character.",
    },
  ],
};
