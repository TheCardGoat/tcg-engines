import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteFairhearted: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "1ie-1",
      text: "NATURAL LEADER This character gains Resist +1 for each other Knight character you have in play.",
      type: "static",
    },
  ],
  cardNumber: 183,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess", "Knight"],
  cost: 5,
  externalIds: {
    ravensburger: "c2b84efc0c0118127f1f4b58632fde2830b55b79",
  },
  franchise: "Snow White",
  fullName: "Snow White - Fair-Hearted",
  id: "1ie",
  inkType: ["steel"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Snow White",
  set: "005",
  strength: 3,
  text: "NATURAL LEADER This character gains Resist +1 for each other Knight character you have in play. (Damage dealt to this character is reduced by 1 for each other Knight.)",
  version: "Fair-Hearted",
  willpower: 5,
};
