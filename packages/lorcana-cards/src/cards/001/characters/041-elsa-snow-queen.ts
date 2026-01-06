import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const elsa: CharacterCard = {
  id: "u2z",
  cardType: "character",
  name: "Elsa",
  version: "Snow Queen",
  fullName: "Elsa - Snow Queen",
  inkType: [
    "amethyst",
  ],
  franchise: "Frozen",
  set: "001",
  text: "**Freeze** {E} - Exert chosen opposing character.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 41,
  inkable: true,
  rarity: "uncommon",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 492705,
  },
  classifications: [
    "Hero",
    "Dreamborn",
    "Queen",
    "Sorcerer",
  ],
  abilities: [
    {
      type: "activated",
      cost: {
          exert: true,
        },
      effect: {
          type: "exert",
          target: "CHOSEN_CHARACTER",
        },
      name: "Freeze",
      id: "u2z-1",
      text: "Exert chosen opposing character.",
    },
  ],
};
