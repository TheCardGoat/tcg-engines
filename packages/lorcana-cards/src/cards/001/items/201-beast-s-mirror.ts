import type { ItemCard } from "@tcg/lorcana-types/cards/card-types";

export const beastSMirror: ItemCard = {
  id: "ysg",
  cardType: "item",
  name: "Beast's Mirror",
  version: "",
  fullName: "Beast's Mirror",
  inkType: [
    "steel",
  ],
  franchise: "General",
  set: "001",
  text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
  cost: 2,
  cardNumber: 201,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 493486,
  },
  abilities: [
    {
      type: "activated",
      cost: {
          exert: true,
          ink: 3,
        },
      effect: {
          type: "draw",
          amount: 1,
          target: {
            ref: "controller",
          },
        },
      name: "Show Me",
      id: "ysg-1",
      text: "If you have no cards in your hand, draw a card.",
    },
  ],
};
