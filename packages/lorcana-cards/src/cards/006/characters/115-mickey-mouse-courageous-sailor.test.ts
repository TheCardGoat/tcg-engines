// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { mickeyMouseCourageousSailor } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mickey Mouse - Courageous Sailor", () => {
//   it.skip("SOLID GROUND While this character is at a location, he gets +2 {S}.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mickeyMouseCourageousSailor.cost,
//       play: [mickeyMouseCourageousSailor],
//       hand: [mickeyMouseCourageousSailor],
//     });
//
//     await testEngine.playCard(mickeyMouseCourageousSailor);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
