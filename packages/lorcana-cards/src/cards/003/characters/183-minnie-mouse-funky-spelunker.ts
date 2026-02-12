import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseFunkySpelunker: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "11y-1",
      text: "JOURNEY While this character is at a location, she gets +2 {S}.",
      type: "static",
    },
  ],
  cardNumber: 183,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 1,
  externalIds: {
    ravensburger: "03cd2ba64edd0e7a28f0f078e1b44e0cff723283",
  },
  fullName: "Minnie Mouse - Funky Spelunker",
  id: "11y",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Minnie Mouse",
  set: "003",
  strength: 0,
  text: "JOURNEY While this character is at a location, she gets +2 {S}.",
  version: "Funky Spelunker",
  willpower: 3,
};
