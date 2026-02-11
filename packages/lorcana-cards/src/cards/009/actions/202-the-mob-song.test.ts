// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { theMobSong } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Mob Song", () => {
//   It.skip("**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theMobSong.cost,
//       Play: [theMobSong],
//       Hand: [theMobSong],
//     });
//
//     Await testEngine.playCard(theMobSong);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Deal 3 damage to up to 3 chosen characters and/or locations.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theMobSong.cost,
//       Play: [theMobSong],
//       Hand: [theMobSong],
//     });
//
//     Await testEngine.playCard(theMobSong);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
