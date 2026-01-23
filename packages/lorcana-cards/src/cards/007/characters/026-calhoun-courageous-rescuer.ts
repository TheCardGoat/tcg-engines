import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounCourageousRescuer: CharacterCard = {
  id: "1m4",
  cardType: "character",
  name: "Calhoun",
  version: "Courageous Rescuer",
  fullName: "Calhoun - Courageous Rescuer",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Calhoun.)\nBACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 26,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d15917edc226a4d5a0f74f8b78306c814c3c1a48",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const calhounCourageousRescuer: LorcanitoCharacterCard = {
//   id: "nan",
//   name: "Calhoun",
//   title: "Courageous Rescuer",
//   characteristics: ["floodborn", "hero", "racer"],
//   text: "Shift 4\nBACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Calhoun"),
//     wheneverChallengesAnotherChar({
//       name: "BACK TO START POSITIONS!",
//       text: "Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "characteristics",
//                 value: ["racer"],
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//
//   colors: ["amber", "ruby"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Alice Pisoni",
//   number: 26,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618130,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
