import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchCovertAgent: CharacterCard = {
  id: "1c3",
  cardType: "character",
  name: "Stitch",
  version: "Covert Agent",
  fullName: "Stitch - Covert Agent",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "003",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nHIDE While this character is at a location, he gains Ward. (Opponents can't choose them except to challenge.)",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 89,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ad3cc196c4a8bfac7a7bfd593107b6b1e1bebe29",
  },
  abilities: [
    {
      id: "1c3-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1c3-2",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "SELF",
      },
      text: "HIDE While this character is at a location, he gains Ward.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Alien"],
};
