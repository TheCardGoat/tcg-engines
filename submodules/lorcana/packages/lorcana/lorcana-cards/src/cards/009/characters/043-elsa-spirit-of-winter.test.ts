// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { elsaSpiritOfWinter } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Elsa - Spirit of Winter", () => {
//   It.skip("**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [elsaSpiritOfWinter],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(elsaSpiritOfWinter);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: elsaSpiritOfWinter.cost,
//       Hand: [elsaSpiritOfWinter],
//     });
//
//     Await testEngine.playCard(elsaSpiritOfWinter);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
