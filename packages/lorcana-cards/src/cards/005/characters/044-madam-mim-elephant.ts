import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimElephant: CharacterCard = {
  id: "gma",
  cardType: "character",
  name: "Madam Mim",
  version: "Elephant",
  fullName: "Madam Mim - Elephant",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "A LITTLE GAME When you play this character, banish her or return another chosen character of yours to your hand.\nSNEAKY MOVE At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
  cost: 4,
  strength: 3,
  willpower: 7,
  lore: 1,
  cardNumber: 44,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3be540ae6b1e1b0bbf8aa74167e10c34c7f76a20",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { madameMimAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const madamMimElephant: LorcanitoCharacterCard = {
//   id: "txu",
//   missingTestCase: true,
//   name: "Madam Mim",
//   title: "Elephant",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**A LITTLE GAME** When you play this character, banish her or return another chosen character of yours to your hand.\n\n **SNEAKY MOVE** At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
//   type: "character",
//   abilities: [
//     {
//       ...madameMimAbility,
//       name: "A little game",
//     },
//     atTheStartOfYourTurn({
//       name: "Sneaky Move",
//       text: "At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
//       optional: true,
//       effects: [
//         moveDamageEffect({
//           amount: 2,
//           from: thisCharacter,
//           to: chosenOpposingCharacter,
//         }),
//       ],
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             ...thisCharacter.filters,
//             {
//               filter: "status",
//               value: "damage",
//               comparison: { operator: "gte", value: 1 },
//             },
//           ],
//           comparison: { operator: "gt", value: 0 },
//         },
//         {
//           type: "filter",
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "opponent" },
//             { filter: "zone", value: "play" },
//           ],
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 7,
//   lore: 1,
//   illustrator: "Kenneth Anderson",
//   number: 44,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560092,
//   },
//   rarity: "super_rare",
// };
//
