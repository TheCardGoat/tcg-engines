import type { CharacterCard } from "@tcg/lorcana-types";

export const mullinsSeasonedShipmate: CharacterCard = {
  id: "meu",
  cardType: "character",
  name: "Mullins",
  version: "Seasoned Shipmate",
  fullName: "Mullins - Seasoned Shipmate",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  text: "FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 5,
  strength: 6,
  willpower: 4,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "50c699882acf4c49f535574ca8c8d34101ab6ff3",
  },
  abilities: [
    {
      id: "meu-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 1,
      },
      text: "FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
};
