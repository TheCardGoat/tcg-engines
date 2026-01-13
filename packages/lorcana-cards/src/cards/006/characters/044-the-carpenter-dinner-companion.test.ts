// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { theCarpenterDinnerCompanion } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Carpenter - Dinner Companion", () => {
//   it.skip("I'LL GET YOU! When this character is banished, you may exert chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: theCarpenterDinnerCompanion.cost,
//       play: [theCarpenterDinnerCompanion],
//       hand: [theCarpenterDinnerCompanion],
//     });
//
//     await testEngine.playCard(theCarpenterDinnerCompanion);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
