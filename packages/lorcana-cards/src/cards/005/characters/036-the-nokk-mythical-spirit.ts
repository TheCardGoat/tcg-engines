import type { CharacterCard } from "@tcg/lorcana-types";

export const theNokkMythicalSpirit: CharacterCard = {
  id: "ybd",
  cardType: "character",
  name: "The Nokk",
  version: "Mythical Spirit",
  fullName: "The Nokk - Mythical Spirit",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "TURNING TIDES When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  cardNumber: 36,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7bad7251f3367547d9b0c27a5401a24cf5853ffc",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { moveDamageAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const theNokkMythicalSpirit: LorcanitoCharacterCard = {
//   id: "abr",
//   missingTestCase: true,
//   name: "The Nokk",
//   title: "Mythical Spirit",
//   characteristics: ["storyborn", "ally"],
//   text: "**TURNING TIDES** When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//   type: "character",
//   abilities: [
//     {
//       name: "TURNING TIDES",
//       text: "When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//       optional: true,
//       ...moveDamageAbility({
//         amount: 2,
//         from: chosenCharacter,
//         to: chosenOpposingCharacter,
//       }),
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Randy Bishop",
//   number: 36,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561486,
//   },
//   rarity: "common",
// };
//
