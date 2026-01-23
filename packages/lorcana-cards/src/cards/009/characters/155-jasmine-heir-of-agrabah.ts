import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineHeirOfAgrabah: CharacterCard = {
  id: "1sv",
  cardType: "character",
  name: "Jasmine",
  version: "Heir of Agrabah",
  fullName: "Jasmine - Heir of Agrabah",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "009",
  text: "I'M A FAST LEARNER When you play this character, remove up to 1 damage from chosen character of yours.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 155,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e9c6176500a03f40326172c37792d499cd93be4a",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { jasmineHeirOfAgrabah as jasmineHeirOfAgrabahAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/151-jasmine-heir-of-agrabah";
//
// export const jasmineHeirOfAgrabah: LorcanitoCharacterCard = {
//   ...jasmineHeirOfAgrabahAsOrig,
//   id: "cqu",
//   reprints: [jasmineHeirOfAgrabahAsOrig.id],
//   number: 155,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650090,
//   },
// };
//
