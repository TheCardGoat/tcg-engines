// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { bronxFerociousBeast } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bronx - Ferocious Beast", () => {
//   It.skip("Reckless", async () => {
//     Const testEngine = new TestEngine({
//       Play: [bronxFerociousBeast],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(bronxFerociousBeast);
//     Expect(cardUnderTest.hasReckless).toBe(true);
//   });
//
//   It.skip("STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: bronxFerociousBeast.cost,
//       Play: [bronxFerociousBeast],
//       Hand: [bronxFerociousBeast],
//     });
//
//     Await testEngine.playCard(bronxFerociousBeast);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
