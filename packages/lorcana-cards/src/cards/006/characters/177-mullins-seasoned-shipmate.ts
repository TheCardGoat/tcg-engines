import type { CharacterCard } from "@tcg/lorcana-types";

export const mullinsSeasonedShipmate: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 1,
      },
      id: "meu-1",
      text: "FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1.",
      type: "action",
    },
  ],
  cardNumber: 177,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Pirate"],
  cost: 5,
  externalIds: {
    ravensburger: "50c699882acf4c49f535574ca8c8d34101ab6ff3",
  },
  franchise: "Peter Pan",
  fullName: "Mullins - Seasoned Shipmate",
  id: "meu",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mullins",
  set: "006",
  strength: 6,
  text: "FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)",
  version: "Seasoned Shipmate",
  willpower: 4,
};
