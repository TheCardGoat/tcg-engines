// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AntonioMadrigalFriendToAll,
//   AntoniosJaguarFaithfulCompanion,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Antonio's Jaguar - Faithful Companion", () => {
//   It("YOU WANT TO GO WHERE? When you play this character, if you have a character in play named Antonio Madrigal, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: antoniosJaguarFaithfulCompanion.cost,
//       Hand: [antoniosJaguarFaithfulCompanion],
//       Play: [antonioMadrigalFriendToAll],
//     });
//
//     Await testEngine.playCard(antoniosJaguarFaithfulCompanion);
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
//     //await testEngine.resolveTopOfStack({});
//   });
//   It("YOU WANT TO GO WHERE? When you play this character, if you have a character in play named Antonio Madrigal, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: antoniosJaguarFaithfulCompanion.cost,
//       Hand: [antoniosJaguarFaithfulCompanion],
//     });
//
//     Await testEngine.playCard(antoniosJaguarFaithfulCompanion);
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toEqual(0);
//     //await testEngine.resolveTopOfStack({});
//   });
// });
//
