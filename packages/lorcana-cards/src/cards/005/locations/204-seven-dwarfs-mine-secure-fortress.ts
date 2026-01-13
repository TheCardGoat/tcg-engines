import type { LocationCard } from "@tcg/lorcana-types";

export const sevenDwarfsMineSecureFortress: LocationCard = {
  id: "135",
  cardType: "location",
  name: "Seven Dwarfs' Mine",
  version: "Secure Fortress",
  fullName: "Seven Dwarfs' Mine - Secure Fortress",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "MOUNTAIN DEFENSE During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 204,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e1b0a38fb5b409a3bec3019fd820810ef7faf7a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { whenYouMoveACharacterHere } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { dealDamageToChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const sevenDwarfsMineSecureFortress: LorcanitoLocationCard = {
//   id: "m2o",
//   name: "Seven Dwarfs' Mine",
//   title: "Secure Fortress",
//   characteristics: ["location"],
//   text: "**MOUNTAIN DEFENSE** During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
//   type: "location",
//   abilities: [
//     whenYouMoveACharacterHere({
//       name: "Mountain Defense",
//       text: "During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
//       optional: true,
//       conditions: [
//         { type: "first-time-move-to-location" },
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       target: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "characteristics", value: ["knight"] },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//       effects: [dealDamageToChosenCharacter(2)],
//     }),
//     whenYouMoveACharacterHere({
//       name: "Mountain Defense",
//       text: "During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
//       optional: true,
//       conditions: [
//         { type: "first-time-move-to-location" },
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       target: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "characteristics", value: ["knight"], negate: true },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//       effects: [dealDamageToChosenCharacter(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Alexa Rockman",
//   number: 204,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561853,
//   },
//   rarity: "uncommon",
//   moveCost: 2,
// };
//
