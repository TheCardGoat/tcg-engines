// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { theCarpenterDinnerCompanion } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Carpenter - Dinner Companion", () => {
//   It.skip("I'LL GET YOU! When this character is banished, you may exert chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theCarpenterDinnerCompanion.cost,
//       Play: [theCarpenterDinnerCompanion],
//       Hand: [theCarpenterDinnerCompanion],
//     });
//
//     Await testEngine.playCard(theCarpenterDinnerCompanion);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
