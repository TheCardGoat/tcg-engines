import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellTemperamentalFairy: CharacterCard = {
  id: "yus",
  cardType: "character",
  name: "Tinker Bell",
  version: "Temperamental Fairy",
  fullName: "Tinker Bell - Temperamental Fairy",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "010",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Tinker Bell.)\nHARMLESS DIVERSION When you play this character, exert chosen opposing character with 2 {S} or less.",
  cost: 5,
  strength: 5,
  willpower: 3,
  lore: 1,
  cardNumber: 115,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7d9ec2509c9bb4c8d087b0bc58d9209bbd9ff4b3",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const tinkerBellTemperamentalFairy: LorcanitoCharacterCard = {
//   id: "zou",
//   name: "Tinker Bell",
//   title: "Temperamental Fairy",
//   characteristics: ["floodborn", "ally", "fairy"],
//   text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Tinker Bell.)\nHARMLESS DIVERSION When you play this character, exert chosen opposing character with 2 {S} or less.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 5,
//   willpower: 3,
//   illustrator: "Malia Ewart",
//   number: 115,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659191,
//   },
//   rarity: "uncommon",
//   abilities: [
//     shiftAbility(3, "Tinker Bell"),
//     whenYouPlayThisCharacter({
//       name: "HARMLESS DIVERSION",
//       text: "When you play this character, exert chosen opposing character with 2 {S} or less.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
