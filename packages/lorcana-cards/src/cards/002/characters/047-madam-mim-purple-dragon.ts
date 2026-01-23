import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimPurpleDragon: CharacterCard = {
  id: "12t",
  cardType: "character",
  name: "Madam Mim",
  version: "Purple Dragon",
  fullName: "Madam Mim - Purple Dragon",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nI WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 4,
  cardNumber: 47,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8beb7231237cf3bc2a7b1289fd773536113e9112",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   evasiveAbility,
//   madameMimAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const madamMimPurpleDragon: LorcanitoCharacterCard = {
//   id: "x3t",
//   name: "Madam Mim",
//   title: "Purple Dragon",
//   characteristics: ["sorcerer", "storyborn", "villain", "dragon"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**I WIN, I WIN!** When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     {
//       ...madameMimAbility,
//       name: "I win win",
//       text: "When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 2,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Did I say no purple dragons? Did I?",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 5,
//   willpower: 7,
//   lore: 4,
//   illustrator: "Ally Zermeno",
//   number: 47,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 523223,
//   },
//   rarity: "legendary",
// };
//
