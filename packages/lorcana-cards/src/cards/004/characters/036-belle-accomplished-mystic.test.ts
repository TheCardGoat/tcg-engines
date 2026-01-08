// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   donaldDuck,
//   mickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   goofyKnightForADay,
//   madamMimSnake,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import {
//   belleAccomplishedMystic,
//   goofySuperGoof,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Belle - Accomplished Mystic", () => {
//   it("**ENHANCED HEALING** When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: belleAccomplishedMystic.cost * 2 + madamMimSnake.cost,
//         play: [goofySuperGoof, donaldDuck],
//         hand: [belleAccomplishedMystic, madamMimSnake],
//       },
//       {
//         play: [mickeyBraveLittleTailor, goofyKnightForADay],
//       },
//     );
//
//     await testEngine.setCardDamage(donaldDuck, 2);
//     await testEngine.playCard(
//       belleAccomplishedMystic,
//       {
//         targets: [donaldDuck],
//       },
//       true,
//     );
//     await testEngine.resolveTopOfStack({
//       targets: [goofyKnightForADay],
//     });
//
//     expect(testEngine.getCardModel(donaldDuck).damage).toBe(0);
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(2);
//
//     // Returning Belle to the hand, so we can test teh same instance of the card model
//     await testEngine.playCard(
//       madamMimSnake,
//       {
//         targets: [belleAccomplishedMystic],
//         acceptOptionalLayer: true,
//       },
//       true,
//     );
//     expect(testEngine.getCardModel(belleAccomplishedMystic).zone).toBe("hand");
//
//     await testEngine.setCardDamage(goofySuperGoof, 3);
//     await testEngine.playCard(
//       belleAccomplishedMystic,
//       {
//         targets: [goofySuperGoof],
//       },
//       true,
//     );
//     await testEngine.resolveTopOfStack({
//       targets: [mickeyBraveLittleTailor],
//     });
//
//     expect(testEngine.getCardModel(goofySuperGoof).damage).toBe(0);
//     expect(testEngine.getCardModel(mickeyBraveLittleTailor).damage).toBe(3);
//   });
// });
//
// describe("Regression", () => {
//   it("Should be able to move less than 3 damage", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: belleAccomplishedMystic.cost + mickeyBraveLittleTailor.cost,
//         play: [mickeyBraveLittleTailor],
//         hand: [belleAccomplishedMystic],
//       },
//       {
//         play: [goofyKnightForADay],
//       },
//     );
//
//     await testEngine.setCardDamage(mickeyBraveLittleTailor, 4);
//     await testEngine.playCard(
//       belleAccomplishedMystic,
//       {
//         targets: [mickeyBraveLittleTailor],
//         amount: 2,
//       },
//       true,
//     );
//     await testEngine.resolveTopOfStack({
//       targets: [goofyKnightForADay],
//     });
//
//     expect(testEngine.getCardModel(mickeyBraveLittleTailor).damage).toBe(2);
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(2);
//   });
// });
//
