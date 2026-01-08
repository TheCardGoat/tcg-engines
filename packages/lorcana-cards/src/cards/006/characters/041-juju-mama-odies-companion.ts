import type { CharacterCard } from "@tcg/lorcana-types";

export const jujuMamaOdiesCompanion: CharacterCard = {
  id: "fzy",
  cardType: "character",
  name: "Juju",
  version: "Mama Odie's Companion",
  fullName: "Juju - Mama Odie's Companion",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "006",
  text: "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 41,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "39a8ffade10cf36dfd0f60244ac7f44bc589453a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const jujuMamaOdiesCompanion: LorcanitoCharacterCard = {
//   id: "kbm",
//   missingTestCase: true,
//   name: "Juju",
//   title: "Mama Odie's Companion",
//   characteristics: ["storyborn", "ally"],
//   text: "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         moveDamageEffect({
//           amount: 1,
//           from: chosenCharacter,
//           to: chosenOpposingCharacter,
//         }),
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Jeanne Plounevez",
//   number: 41,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588154,
//   },
//   rarity: "common",
// };
//
