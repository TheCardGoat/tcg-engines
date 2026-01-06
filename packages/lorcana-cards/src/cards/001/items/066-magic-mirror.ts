import type { ItemCard } from "@tcg/lorcana-types/cards/card-types";

export const magicMirror: ItemCard = {
  id: "bql",
  cardType: "item",
  name: "Magic Mirror",
  version: "",
  fullName: "Magic Mirror",
  inkType: ["amethyst"],
  franchise: "Snow White and the Seven Dwarfs",
  set: "001",
  text: "**Speak** {E}, 4 {I} - Draw a card.",
  cost: 2,
  cardNumber: 66,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 492714,
  },
  abilities: [
    {
      type: "activated",
      cost: {
        exert: true,
        ink: 4,
      },
      effect: {
        type: "draw",
        amount: 1,
        target: {
          ref: "controller",
        },
      },
      name: "Speak",
      id: "bql-1",
      text: "{E}, 4 {I} - Draw a card.",
    },
  ],
};
