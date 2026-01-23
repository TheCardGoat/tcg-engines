import type { CharacterCard } from "@tcg/lorcana-types";

export const princeNaveenPennilessRoyal: CharacterCard = {
  id: "121",
  cardType: "character",
  name: "Prince Naveen",
  version: "Penniless Royal",
  fullName: "Prince Naveen - Penniless Royal",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "009",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 182,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "89ba3705b86865c9670a40d72bf4c264e01414e3",
  },
  classifications: ["Storyborn", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { princeNaveenPennilessRoyal as princeNaveenPennilessRoyalAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/191-prince-naveen-penniless-royal";
//
// export const princeNaveenPennilessRoyal: LorcanitoCharacterCard = {
//   ...princeNaveenPennilessRoyalAsOrig,
//   id: "lx6",
//   reprints: [princeNaveenPennilessRoyalAsOrig.id],
//   number: 182,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650115,
//   },
// };
//
