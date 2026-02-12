import type { CharacterCard } from "@tcg/lorcana-types";

export const scroopBackstabber: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "58w-1",
      text: "BRUTE While this character has damage, he gets +3 {S}.",
      type: "static",
    },
  ],
  cardNumber: 122,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Alien", "Pirate"],
  cost: 5,
  externalIds: {
    ravensburger: "12e992ed5c1b1f3b4983f8fe3780e871b2743fb4",
  },
  franchise: "Treasure Planet",
  fullName: "Scroop - Backstabber",
  id: "58w",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Scroop",
  set: "003",
  strength: 2,
  text: "BRUTE While this character has damage, he gets +3 {S}.",
  version: "Backstabber",
  willpower: 5,
};
