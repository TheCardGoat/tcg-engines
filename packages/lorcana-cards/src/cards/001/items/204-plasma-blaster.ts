import type { ItemCard } from "@tcg/lorcana-types/cards/card-types";

export const plasmaBlaster: ItemCard = {
  id: "t4y",
  cardType: "item",
  name: "Plasma Blaster",
  version: "",
  fullName: "Plasma Blaster",
  inkType: [
    "steel",
  ],
  franchise: "General",
  set: "001",
  text: "**QUICK SHOT** {E}, 2 {I} − Deal 1 damage to chosen character.",
  cost: 3,
  cardNumber: 204,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508929,
  },
  abilities: [
    {
      type: "activated",
      cost: {
          exert: true,
          ink: 2,
        },
      effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
      name: "Quick Shot",
      id: "t4y-1",
      text: "Deal 1 damage to chosen character.",
    },
  ],
};
