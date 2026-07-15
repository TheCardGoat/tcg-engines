// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { skullRockIsolatedFortress } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Skull Rock - Isolated Fortress", () => {
//   It.skip("FAMILIAR GROUND Characters get +1 {S} while here.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: skullRockIsolatedFortress.cost,
//       Play: [skullRockIsolatedFortress],
//       Hand: [skullRockIsolatedFortress],
//     });
//
//     Await testEngine.playCard(skullRockIsolatedFortress);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("SAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: skullRockIsolatedFortress.cost,
//       Play: [skullRockIsolatedFortress],
//       Hand: [skullRockIsolatedFortress],
//     });
//
//     Await testEngine.playCard(skullRockIsolatedFortress);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
