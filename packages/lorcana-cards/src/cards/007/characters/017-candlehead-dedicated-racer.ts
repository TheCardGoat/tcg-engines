import type { CharacterCard } from "@tcg/lorcana-types";

export const candleheadDedicatedRacer: CharacterCard = {
  id: "w07",
  cardType: "character",
  name: "Candlehead",
  version: "Dedicated Racer",
  fullName: "Candlehead - Dedicated Racer",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 17,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "735997cb2d2bb3550d9657a45ff6656a73b7c2eb",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const candleheadDedicatedRacer: LorcanitoCharacterCard = {
//   id: "rqj",
//   name: "Candlehead",
//   title: "Dedicated Racer",
//   characteristics: ["storyborn", "ally", "racer"],
//   text: "WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "WINNING ISN'T EVERYTHING",
//       text: "When this character is banished, you may remove up to 2 damage from chosen character.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Xapik",
//   number: 17,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618717,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
