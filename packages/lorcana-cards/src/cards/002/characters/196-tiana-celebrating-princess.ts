import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaCelebratingPrincess: CharacterCard = {
  id: "14e",
  cardType: "character",
  name: "Tiana",
  version: "Celebrating Princess",
  fullName: "Tiana - Celebrating Princess",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "Resist +2 (Damage dealt to this character is reduced by 2.)\nWHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 196,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "910acc88a200a28dc9c862c38ead8d1f52ae921c",
  },
  abilities: [
    {
      id: "14e-1",
      type: "keyword",
      keyword: "Resist",
      value: 2,
      text: "Resist +2",
    },
    {
      id: "14e-2",
      type: "static",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "WHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
