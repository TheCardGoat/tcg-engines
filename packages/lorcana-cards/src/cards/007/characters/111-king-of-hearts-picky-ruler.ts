import type { CharacterCard } from "@tcg/lorcana-types";

export const kingOfHeartsPickyRuler: CharacterCard = {
  id: "om1",
  cardType: "character",
  name: "King of Hearts",
  version: "Picky Ruler",
  fullName: "King of Hearts - Picky Ruler",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "OBJECTIONABLE STATE Damaged characters can't challenge your characters.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 111,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "58b431f0b98bc1d4b41d41d858487fce9f552032",
  },
  abilities: [
    {
      id: "om1-1",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
      text: "OBJECTIONABLE STATE Damaged characters can't challenge your characters.",
    },
  ],
  classifications: ["Storyborn", "Ally", "King"],
};
