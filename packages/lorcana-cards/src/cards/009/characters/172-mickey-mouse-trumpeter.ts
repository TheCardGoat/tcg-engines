import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseTrumpeter: CharacterCard = {
  id: "6jz",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Trumpeter",
  fullName: "Mickey Mouse - Trumpeter",
  inkType: ["steel"],
  set: "009",
  text: "SOUND THE CALL {E}, 2 {I} — Play a character for free.",
  cost: 4,
  strength: 0,
  willpower: 1,
  lore: 1,
  cardNumber: 172,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "179fc22003ba7747cc37f42fe012a724fc2bd364",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { mickeyMouseTrumpeter as mickeyMouseTrumpeterAsOrig } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const mickeyMouseTrumpeter: LorcanitoCharacterCard = {
//   ...mickeyMouseTrumpeterAsOrig,
//   id: "ftq",
//   reprints: [mickeyMouseTrumpeterAsOrig.id],
//   number: 172,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650106,
//   },
// };
//
