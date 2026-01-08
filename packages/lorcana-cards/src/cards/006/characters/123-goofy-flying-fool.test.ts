// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyFlyingFool } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Goofy - Flying Fool", () => {
//   it.skip("Rush (This character can challenge the turn they're played.)", async () => {
//     const testEngine = new TestEngine({
//       play: [goofyFlyingFool],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(goofyFlyingFool);
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [goofyFlyingFool],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(goofyFlyingFool);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
