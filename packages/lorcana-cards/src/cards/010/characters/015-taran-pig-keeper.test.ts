// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   henWenPropheticPig,
//   taranPigKeeper,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Taran - Pig Keeper", () => {
//   it("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     const testEngine = new TestEngine({
//       play: [taranPigKeeper],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(taranPigKeeper);
//     expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   it("FOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.", async () => {
//     const testEngine = new TestEngine({
//       play: [taranPigKeeper],
//       discard: [henWenPropheticPig],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(taranPigKeeper);
//     const henWen = testEngine.getCardModel(henWenPropheticPig);
//
//     await testEngine.questCard(cardUnderTest);
//
//     expect(testEngine.getLoreForPlayer("player_one")).toEqual(2);
//
//     await testEngine.skipTopOfStack();
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [henWen] }, true);
//
//     expect(henWen.zone).toBe("hand");
//   });
// });
//
