import type { CharacterCard } from "@tcg/lorcana-types";

export const sergeantTibbsCourageousCat: CharacterCard = {
  id: "xph",
  cardType: "character",
  name: "Sergeant Tibbs",
  version: "Courageous Cat",
  fullName: "Sergeant Tibbs - Courageous Cat",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "009",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 128,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "797c561f7aae7add36d914600e9d79941726236f",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { seargentTibbies as sergeantTibbsCourageousCatAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/124-sergeant-tibbs-courageous-cat";
//
// export const sergeantTibbsCourageousCat: LorcanitoCharacterCard = {
//   ...sergeantTibbsCourageousCatAsOrig,
//   id: "cz0",
//   reprints: [sergeantTibbsCourageousCatAsOrig.id],
//   number: 128,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650063,
//   },
// };
//
