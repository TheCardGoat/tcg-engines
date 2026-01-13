import type { CharacterCard } from "@tcg/lorcana-types";

export const annaMysticalMajesty: CharacterCard = {
  id: "iok",
  cardType: "character",
  name: "Anna",
  version: "Mystical Majesty",
  fullName: "Anna - Mystical Majesty",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)\nEXCEPTIONAL POWER When you play this character, exert all opposing characters.",
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 46,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "435579c3cb397e6133a748ff09f53a84bb5a48ff",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { exertAllOpposingCharacters } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const annaMysticalMajesty: LorcanitoCharacterCard = {
//   id: "e80",
//   name: "Anna",
//   title: "Mystical Majesty",
//   characteristics: ["hero", "floodborn", "queen", "sorcerer"],
//   text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Anna.)_\n  \n**EXCEPTIONAL POWER** When you play this character, exert all opposing characters.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Anna"),
//     {
//       type: "resolution",
//       name: "EXCEPTIONAL POWER",
//       text: "When you play this character, exert all opposing characters.",
//       effects: [exertAllOpposingCharacters],
//     },
//   ],
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 4,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Jackie Droujko",
//   number: 46,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561952,
//   },
//   rarity: "rare",
// };
//
