import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganRagingRat: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1g7-1",
      text: "NOTHING CAN STAND IN MY WAY While this character has damage, he gets +2 {S}.",
      type: "static",
    },
  ],
  cardNumber: 113,
  cardType: "character",
  classifications: ["Dreamborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "bc26272317330401d45feffba7e17f0e155eac93",
  },
  franchise: "Great Mouse Detective",
  fullName: "Ratigan - Raging Rat",
  id: "1g7",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Ratigan",
  set: "005",
  strength: 1,
  text: "NOTHING CAN STAND IN MY WAY While this character has damage, he gets +2 {S}.",
  version: "Raging Rat",
  willpower: 5,
};
