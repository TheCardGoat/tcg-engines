import type { CharacterCard } from "@tcg/lorcana-types";

export const kingOfHeartsPickyRuler: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "om1-1",
      text: "OBJECTIONABLE STATE Damaged characters can't challenge your characters.",
      type: "action",
    },
  ],
  cardNumber: 111,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "King"],
  cost: 4,
  externalIds: {
    ravensburger: "58b431f0b98bc1d4b41d41d858487fce9f552032",
  },
  franchise: "Alice in Wonderland",
  fullName: "King of Hearts - Picky Ruler",
  id: "om1",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "King of Hearts",
  set: "007",
  strength: 3,
  text: "OBJECTIONABLE STATE Damaged characters can't challenge your characters.",
  version: "Picky Ruler",
  willpower: 3,
};
