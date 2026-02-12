// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { hundredAcreIslandPoohsHome } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hundred Acre Island - Pooh's Home", () => {
//   It.skip("FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hundredAcreIslandPoohsHome.cost,
//       Play: [hundredAcreIslandPoohsHome],
//       Hand: [hundredAcreIslandPoohsHome],
//     });
//
//     Await testEngine.playCard(hundredAcreIslandPoohsHome);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
