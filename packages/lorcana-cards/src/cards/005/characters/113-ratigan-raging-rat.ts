import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganRagingRat: CharacterCard = {
  id: "1g7",
  cardType: "character",
  name: "Ratigan",
  version: "Raging Rat",
  fullName: "Ratigan - Raging Rat",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "NOTHING CAN STAND IN MY WAY While this character has damage, he gets +2 {S}.",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 113,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bc26272317330401d45feffba7e17f0e155eac93",
  },
  abilities: [
    {
      id: "1g7-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "NOTHING CAN STAND IN MY WAY While this character has damage, he gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
