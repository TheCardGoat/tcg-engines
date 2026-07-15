// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { trialsAndTribulations } from "@lorcanito/lorcana-engine/cards/008";
// Import {
//   MaxGoofRebelliousTeen,
//   MotherKnowsBest,
// } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Max Goof - Rebellious Teen", () => {
//   It("PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: maxGoofRebelliousTeen.cost + 1,
//       Hand: [maxGoofRebelliousTeen],
//       Discard: [trialsAndTribulations],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(maxGoofRebelliousTeen);
//     Const cardTarget = testEngine.getCardModel(trialsAndTribulations);
//
//     Expect(cardTarget.zone).toBe("discard");
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//     Expect(cardTarget.zone).toBe("hand");
//   });
// });
//
// Describe("Regression Test", () => {
//   It("Interaction with Mother Knows Best", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: maxGoofRebelliousTeen.cost + 1,
//       Hand: [maxGoofRebelliousTeen],
//       Discard: [motherKnowsBest],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(maxGoofRebelliousTeen);
//     Const cardTarget = testEngine.getCardModel(motherKnowsBest);
//
//     Expect(cardTarget.zone).toBe("discard");
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//     Expect(cardTarget.zone).toBe("hand");
//   });
// });
//
