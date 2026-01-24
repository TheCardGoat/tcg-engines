import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteFairhearted: CharacterCard = {
  id: "1ie",
  cardType: "character",
  name: "Snow White",
  version: "Fair-Hearted",
  fullName: "Snow White - Fair-Hearted",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "NATURAL LEADER This character gains Resist +1 for each other Knight character you have in play. (Damage dealt to this character is reduced by 1 for each other Knight.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  cardNumber: 183,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c2b84efc0c0118127f1f4b58632fde2830b55b79",
  },
  abilities: [
    {
      id: "1ie-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 1,
      },
      text: "NATURAL LEADER This character gains Resist +1 for each other Knight character you have in play.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess", "Knight"],
};
