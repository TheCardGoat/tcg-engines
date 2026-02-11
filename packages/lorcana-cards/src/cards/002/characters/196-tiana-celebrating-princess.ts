import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaCelebratingPrincess: CharacterCard = {
  abilities: [
    {
      id: "14e-1",
      keyword: "Resist",
      text: "Resist +2",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "14e-2",
      text: "WHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.",
      type: "static",
    },
  ],
  cardNumber: 196,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "910acc88a200a28dc9c862c38ead8d1f52ae921c",
  },
  franchise: "Princess and the Frog",
  fullName: "Tiana - Celebrating Princess",
  id: "14e",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Tiana",
  set: "002",
  strength: 1,
  text: "Resist +2 (Damage dealt to this character is reduced by 2.)\nWHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.",
  version: "Celebrating Princess",
  willpower: 4,
};
