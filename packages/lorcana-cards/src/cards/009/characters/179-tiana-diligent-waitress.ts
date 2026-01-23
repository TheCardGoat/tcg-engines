import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaDiligentWaitress: CharacterCard = {
  id: "qlb",
  cardType: "character",
  name: "Tiana",
  version: "Diligent Waitress",
  fullName: "Tiana - Diligent Waitress",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "009",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 179,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "5fd6b648da175096eb786f728eef9a5e41cd3450",
  },
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { tianaDiligentWaitress as tianaDiligentWaitressAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/197-tiana-diligent-waitress";
//
// export const tianaDiligentWaitress: LorcanitoCharacterCard = {
//   ...tianaDiligentWaitressAsOrig,
//   id: "ljv",
//   reprints: [tianaDiligentWaitressAsOrig.id],
//   number: 179,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650112,
//   },
// };
//
