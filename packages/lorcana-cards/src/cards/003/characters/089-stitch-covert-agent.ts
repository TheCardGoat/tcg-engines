import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchCovertAgent: CharacterCard = {
  abilities: [
    {
      id: "1c3-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Ward",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1c3-2",
      text: "HIDE While this character is at a location, he gains Ward.",
      type: "static",
    },
  ],
  cardNumber: 89,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Alien"],
  cost: 5,
  externalIds: {
    ravensburger: "ad3cc196c4a8bfac7a7bfd593107b6b1e1bebe29",
  },
  franchise: "Lilo and Stitch",
  fullName: "Stitch - Covert Agent",
  id: "1c3",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Stitch",
  set: "003",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nHIDE While this character is at a location, he gains Ward. (Opponents can't choose them except to challenge.)",
  version: "Covert Agent",
  willpower: 3,
};
