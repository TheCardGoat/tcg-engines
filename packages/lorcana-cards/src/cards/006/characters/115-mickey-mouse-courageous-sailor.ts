import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseCourageousSailor: CharacterCard = {
  id: "wqx",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Courageous Sailor",
  fullName: "Mickey Mouse - Courageous Sailor",
  inkType: ["ruby"],
  set: "006",
  text: "SOLID GROUND While this character is at a location, he gets +2 {S}.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 115,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "76067fd15c411217b76ba3aea1ceaa85d6049ec3",
  },
  abilities: [
    {
      id: "wqx-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "SOLID GROUND While this character is at a location, he gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
