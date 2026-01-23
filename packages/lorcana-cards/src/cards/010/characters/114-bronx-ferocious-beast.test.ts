// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { bronxFerociousBeast } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bronx - Ferocious Beast", () => {
//   it.skip("Reckless", async () => {
//     const testEngine = new TestEngine({
//       play: [bronxFerociousBeast],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(bronxFerociousBeast);
//     expect(cardUnderTest.hasReckless).toBe(true);
//   });
//
//   it.skip("STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: bronxFerociousBeast.cost,
//       play: [bronxFerociousBeast],
//       hand: [bronxFerociousBeast],
//     });
//
//     await testEngine.playCard(bronxFerociousBeast);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
