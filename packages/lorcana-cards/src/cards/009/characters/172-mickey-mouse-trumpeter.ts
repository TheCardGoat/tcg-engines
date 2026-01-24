import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseTrumpeter: CharacterCard = {
  id: "6jz",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Trumpeter",
  fullName: "Mickey Mouse - Trumpeter",
  inkType: ["steel"],
  set: "009",
  text: "SOUND THE CALL {E}, 2 {I} — Play a character for free.",
  cost: 4,
  strength: 0,
  willpower: 1,
  lore: 1,
  cardNumber: 172,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "179fc22003ba7747cc37f42fe012a724fc2bd364",
  },
  abilities: [
    {
      id: "6jz-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "play-card",
        from: "hand",
        cardType: "character",
        cost: "free",
      },
      text: "SOUND THE CALL {E}, 2 {I} — Play a character for free.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
