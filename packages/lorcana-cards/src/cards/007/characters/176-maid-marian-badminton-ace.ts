import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianBadmintonAce: CharacterCard = {
  id: "6at",
  cardType: "character",
  name: "Maid Marian",
  version: "Badminton Ace",
  fullName: "Maid Marian - Badminton Ace",
  inkType: ["sapphire", "steel"],
  franchise: "Robin Hood",
  set: "007",
  text: "GOOD SHOT During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.\nFAIR PLAY Your characters named Lady Kluck gain Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 176,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "16b563305b1ebac09f45ac449c05181244aff0e5",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
