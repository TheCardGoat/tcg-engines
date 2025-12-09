import type { CharacterCard } from "@tcg/lorcana";

export const eeyoreOverstuffedDonkey: CharacterCard = {
  id: "16o",
  cardType: "character",
  name: "Eeyore",
  version: "Overstuffed Donkey",
  fullName: "Eeyore - Overstuffed Donkey",
  inkType: ["steel"],
  franchise: "Winnie the Pooh",
  set: "009",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 183,
  inkable: true,
  externalIds: {
    ravensburger: "99d2d33370532b6247f8ecd7ee8301e6c94afd8e",
  },
  keywords: [
    {
      type: "Resist",
      value: 1,
    },
  ],
  abilities: [
    {
      id: "16o-1",
      text: "Resist +1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
