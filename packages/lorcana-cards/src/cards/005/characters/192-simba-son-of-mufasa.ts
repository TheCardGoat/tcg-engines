import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaSonOfMufasa: CharacterCard = {
  id: "xnq",
  cardType: "character",
  name: "Simba",
  version: "Son of Mufasa",
  fullName: "Simba - Son of Mufasa",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Simba.)\nFEARSOME ROAR When you play this character, you may banish chosen item or location.",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 192,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "794f84fd2ebc3cb03afad4d4a6a7dc5cf90a4cd5",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { banishChosenItemOrLocation } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const simbaSonOfMufasa: LorcanitoCharacterCard = {
//   id: "me7",
//   missingTestCase: true,
//   name: "Simba",
//   title: "Son of Mufasa",
//   characteristics: ["hero", "floodborn", "king"],
//   text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Simba.)_ **FEARSOME ROAR** When you play this character, you may banish chosen item or location.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Simba"),
//     {
//       type: "resolution",
//       name: "FEARSOME ROAR",
//       text: "When you play this character, you may banish chosen item or location.",
//       optional: true,
//       effects: [banishChosenItemOrLocation],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 3,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Shannon Hallstein",
//   number: 192,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561974,
//   },
//   rarity: "uncommon",
// };
//
