import type { CharacterCard } from "@tcg/lorcana-types";

export const annaBravingTheStorm: CharacterCard = {
  id: "mi9",
  cardType: "character",
  name: "Anna",
  version: "Braving the Storm",
  fullName: "Anna - Braving the Storm",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "009",
  text: "I WAS BORN READY While you have another Hero character in play, this character gets +1 {L}.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 146,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "511e7eed599c91d73d5cc4ea8991964dc1efe12a",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { annaBravingTheStorm as ogAnnaBravingTheStorm } from "@lorcanito/lorcana-engine/cards/004/characters/137-anna-braving-the-storm";
//
// export const annaBravingTheStorm: LorcanitoCharacterCard = {
//   ...ogAnnaBravingTheStorm,
//   id: "ads", // New ID for this card
//   reprints: [ogAnnaBravingTheStorm.id],
//   number: 146,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650081,
//   },
// };
//
