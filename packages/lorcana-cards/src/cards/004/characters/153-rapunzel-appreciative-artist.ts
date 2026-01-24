import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelAppreciativeArtist: CharacterCard = {
  id: "1qj",
  cardType: "character",
  name: "Rapunzel",
  version: "Appreciative Artist",
  fullName: "Rapunzel - Appreciative Artist",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "004",
  text: "PERCEPTIVE PARTNER While you have a character named Pascal in play, this character gains Ward. (Opponents can't choose them except to challenge.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  cardNumber: 153,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e162ea6cf826b5a99f57c8b44073d06f84dc6995",
  },
  abilities: [
    {
      id: "1qj-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "SELF",
      },
      text: "PERCEPTIVE PARTNER While you have a character named Pascal in play, this character gains Ward.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
