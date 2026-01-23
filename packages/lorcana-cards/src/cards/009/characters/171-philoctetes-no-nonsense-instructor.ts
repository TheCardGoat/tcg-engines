import type { CharacterCard } from "@tcg/lorcana-types";

export const philoctetesNononsenseInstructor: CharacterCard = {
  id: "1r4",
  cardType: "character",
  name: "Philoctetes",
  version: "No-Nonsense Instructor",
  fullName: "Philoctetes - No-Nonsense Instructor",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "009",
  text: "YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1. (They get +1 {S} while challenging.)\nSHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 171,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e37669ed7364c22a0dc38be227ed36b062d4c5cf",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { philoctetesNoNonsenseInstructor as philoctetesNononsenseInstructorAsOrig } from "@lorcanito/lorcana-engine/cards/004/characters/190-philoctetes-no-nonsense-instructor";
//
// export const philoctetesNononsenseInstructor: LorcanitoCharacterCard = {
//   ...philoctetesNononsenseInstructorAsOrig,
//   id: "g10",
//   reprints: [philoctetesNononsenseInstructorAsOrig.id],
//   number: 171,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650105,
//   },
// };
//
