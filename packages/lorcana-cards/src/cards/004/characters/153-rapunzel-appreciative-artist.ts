import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelAppreciativeArtist: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Ward",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1qj-1",
      text: "PERCEPTIVE PARTNER While you have a character named Pascal in play, this character gains Ward.",
      type: "action",
    },
  ],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "e162ea6cf826b5a99f57c8b44073d06f84dc6995",
  },
  franchise: "Tangled",
  fullName: "Rapunzel - Appreciative Artist",
  id: "1qj",
  inkType: ["sapphire"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Rapunzel",
  set: "004",
  strength: 3,
  text: "PERCEPTIVE PARTNER While you have a character named Pascal in play, this character gains Ward. (Opponents can't choose them except to challenge.)",
  version: "Appreciative Artist",
  willpower: 5,
};
