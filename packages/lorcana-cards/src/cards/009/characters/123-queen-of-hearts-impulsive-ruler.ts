import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsImpulsiveRuler: CharacterCard = {
  id: "106",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Impulsive Ruler",
  fullName: "Queen of Hearts - Impulsive Ruler",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "009",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 123,
  inkable: true,
  externalIds: {
    ravensburger: "8260dc617e55b1bdf94da0f0bf4b25bf196d0848",
  },
  abilities: [
    {
      id: "106-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { queenOfHeartsImpulsiveRuler as queenOfHeartsImpulsiveRulerAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/119-queen-of-hearts-impulsive-ruler";
//
// export const queenOfHeartsImpulsiveRuler: LorcanitoCharacterCard = {
//   ...queenOfHeartsImpulsiveRulerAsOrig,
//   id: "tge",
//   reprints: [queenOfHeartsImpulsiveRulerAsOrig.id],
//   number: 123,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650058,
//   },
// };
//
