import type { CharacterCard } from "@tcg/lorcana-types";

export const eeyoreOverstuffedDonkey: CharacterCard = {
  abilities: [
    {
      id: "16o-1",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
  cardNumber: 183,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "99d2d33370532b6247f8ecd7ee8301e6c94afd8e",
  },
  franchise: "Winnie the Pooh",
  fullName: "Eeyore - Overstuffed Donkey",
  id: "16o",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Eeyore",
  set: "009",
  strength: 4,
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  version: "Overstuffed Donkey",
  willpower: 5,
};
