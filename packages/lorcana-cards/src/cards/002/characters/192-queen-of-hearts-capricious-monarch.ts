import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsCapriciousMonarch: CharacterCard = {
  id: "qi9",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Capricious Monarch",
  fullName: "Queen of Hearts - Capricious Monarch",
  inkType: ["steel"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 1,
  cardNumber: 192,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5f88c9d9b2d3f07479499c3c01721501feaa1469",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverOpposingCharIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { readyThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const queenOfHeartsCapriciousMonarch: LorcanitoCharacterCard = {
//   id: "m85",
//
//   name: "Queen of Hearts",
//   title: "Capricious Monarch",
//   characteristics: ["queen", "storyborn", "villain"],
//   text: "**OFF WITH THEIR HEADS!** Whenever an opposing character is banished, you may ready this character.",
//   type: "character",
//   abilities: [
//     wheneverOpposingCharIsBanished({
//       name: "Off with their heads!",
//       text: "Whenever an opposing character is banished, you may ready this character.",
//       optional: true,
//       effects: [readyThisCharacter],
//     }),
//   ],
//   flavour: "The fourth Rule of Villainy: Do whatever it takes to get ahead.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 7,
//   strength: 5,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Jenna Gray",
//   number: 192,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525269,
//   },
//   rarity: "rare",
// };
//
