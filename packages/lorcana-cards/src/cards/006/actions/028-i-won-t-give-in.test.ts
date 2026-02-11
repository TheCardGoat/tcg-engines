// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { iWontGiveIn } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("I Won't Give In", () => {
//   It.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: iWontGiveIn.cost,
//       Play: [iWontGiveIn],
//       Hand: [iWontGiveIn],
//     });
//
//     Await testEngine.playCard(iWontGiveIn);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Return a character card with cost 2 or less from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: iWontGiveIn.cost,
//       Play: [iWontGiveIn],
//       Hand: [iWontGiveIn],
//     });
//
//     Await testEngine.playCard(iWontGiveIn);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
