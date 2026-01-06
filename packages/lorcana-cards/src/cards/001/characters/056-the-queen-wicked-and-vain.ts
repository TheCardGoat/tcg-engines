import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const theQueen: CharacterCard = {
  id: "y32",
  cardType: "character",
  name: "The Queen",
  version: "Wicked and Vain",
  fullName: "The Queen - Wicked and Vain",
  inkType: [
    "amethyst",
  ],
  franchise: "General",
  set: "001",
  text: "**I SUMMON THEE** {E} − Draw a card.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 56,
  inkable: true,
  rarity: "super_rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508751,
  },
  classifications: [
    "Queen",
    "Storyborn",
    "Villain",
  ],
  abilities: [
    {
      type: "activated",
      cost: {
          exert: true,
        },
      effect: {
          type: "draw",
          amount: 1,
          target: {
            ref: "controller",
          },
        },
      name: "I Summon Thee",
      id: "y32-1",
      text: "Draw a card.",
    },
  ],
};
