import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseCourageousSailor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "wqx-1",
      text: "SOLID GROUND While this character is at a location, he gets +2 {S}.",
      type: "static",
    },
  ],
  cardNumber: 115,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "76067fd15c411217b76ba3aea1ceaa85d6049ec3",
  },
  fullName: "Mickey Mouse - Courageous Sailor",
  id: "wqx",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mickey Mouse",
  set: "006",
  strength: 2,
  text: "SOLID GROUND While this character is at a location, he gets +2 {S}.",
  version: "Courageous Sailor",
  willpower: 4,
};
