import type { CharacterCard } from "@tcg/lorcana-types";

export const benjaGuardianOfTheDragonGem: CharacterCard = {
  id: "14h",
  cardType: "character",
  name: "Benja",
  version: "Guardian of the Dragon Gem",
  fullName: "Benja - Guardian of the Dragon Gem",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "WE HAVE A CHOICE When you play this character, you may banish chosen item.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 180,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "91f61fcecd0f1ec5ba977e234746108beae719d3",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { benjaGuardianOfTheDragonGem as ogBenjaGuardianOfTheDragonGem } from "@lorcanito/lorcana-engine/cards/002/characters/174-benja-guardian-of-the-dragon-gem";
//
// export const benjaGuardianOfTheDragonGem: LorcanitoCharacterCard = {
//   ...ogBenjaGuardianOfTheDragonGem,
//   id: "tik",
//   reprints: [ogBenjaGuardianOfTheDragonGem.id],
//   number: 180,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650113,
//   },
// };
//
