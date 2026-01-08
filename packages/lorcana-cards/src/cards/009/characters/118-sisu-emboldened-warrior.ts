import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuEmboldenedWarrior: CharacterCard = {
  id: "1df",
  cardType: "character",
  name: "Sisu",
  version: "Emboldened Warrior",
  fullName: "Sisu - Emboldened Warrior",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "SURGE OF POWER This character gets +1 {S} for each card in opponents' hands.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 118,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b22a4c15d3d32e5cf4e451e8aa8176001b9d2255",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { sisuEmboldenedWarrior as sisuEmboldenedWarriorAsOrig } from "@lorcanito/lorcana-engine/cards/004/characters/124-sisu-emboldened-warrior";
//
// export const sisuEmboldenedWarrior: LorcanitoCharacterCard = {
//   ...sisuEmboldenedWarriorAsOrig,
//   id: "g9x",
//   reprints: [sisuEmboldenedWarriorAsOrig.id],
//   number: 118,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650054,
//   },
// };
//
