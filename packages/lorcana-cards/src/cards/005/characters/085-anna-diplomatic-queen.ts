import type { CharacterCard } from "@tcg/lorcana-types";

export const annaDiplomaticQueen: CharacterCard = {
  id: "1k2",
  cardType: "character",
  name: "Anna",
  version: "Diplomatic Queen",
  fullName: "Anna - Diplomatic Queen",
  inkType: ["emerald"],
  franchise: "Frozen",
  set: "005",
  text: "ROYAL RESOLUTION When you play this character, you may pay 2 {I} to choose one: \n• Each opponent chooses and discards a card. \n• Chosen character gets +2 {S} this turn. \n• Banish chosen damaged character.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 85,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ccc44e0dfdc4c493db2af13ca258445a6e8d8e7b",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Queen"],
};
