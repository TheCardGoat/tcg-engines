// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { kidaCreativeThinker } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kida - Creative Thinker", () => {
//   It.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [kidaCreativeThinker],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(kidaCreativeThinker);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   It.skip("KEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: kidaCreativeThinker.cost,
//       Play: [kidaCreativeThinker],
//       Hand: [kidaCreativeThinker],
//     });
//
//     Await testEngine.playCard(kidaCreativeThinker);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
