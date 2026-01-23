import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchAlienBuccaneer: CharacterCard = {
  id: "19n",
  cardType: "character",
  name: "Stitch",
  version: "Alien Buccaneer",
  fullName: "Stitch - Alien Buccaneer",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Stitch.)\nREADY FOR ACTION When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 72,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a47fda64f881fde3e3a374f0e76152127d4c47e4",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Alien", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const stitchAlienBuccaneer: LorcanitoCharacterCard = {
//   id: "hzt",
//   missingTestCase: true,
//   name: "Stitch",
//   title: "Alien Buccaneer",
//   characteristics: ["hero", "floodborn", "alien", "pirate"],
//   text: "**READY FOR ACTION** _When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck._",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Stitch"),
//     {
//       type: "resolution",
//       name: "READY FOR ACTION",
//       resolutionConditions: [{ type: "resolution", value: "shift" }],
//       optional: true,
//       text: "When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck._",
//       effects: [
//         {
//           type: "move",
//           to: "deck",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "discard" },
//               { filter: "type", value: "action" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Cristian Romero",
//   number: 72,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578176,
//   },
//   rarity: "rare",
// };
//
