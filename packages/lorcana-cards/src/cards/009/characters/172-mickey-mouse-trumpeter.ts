import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseTrumpeter: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        cardType: "character",
        cost: "free",
        from: "hand",
        type: "play-card",
      },
      id: "6jz-1",
      text: "SOUND THE CALL {E}, 2 {I} — Play a character for free.",
      type: "activated",
    },
  ],
  cardNumber: 172,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "179fc22003ba7747cc37f42fe012a724fc2bd364",
  },
  fullName: "Mickey Mouse - Trumpeter",
  id: "6jz",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Mickey Mouse",
  set: "009",
  strength: 0,
  text: "SOUND THE CALL {E}, 2 {I} — Play a character for free.",
  version: "Trumpeter",
  willpower: 1,
};
