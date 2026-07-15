// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HenWenPropheticPig,
//   TaranPigKeeper,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Taran - Pig Keeper", () => {
//   It("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [taranPigKeeper],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(taranPigKeeper);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It("FOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [taranPigKeeper],
//       Discard: [henWenPropheticPig],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(taranPigKeeper);
//     Const henWen = testEngine.getCardModel(henWenPropheticPig);
//
//     Await testEngine.questCard(cardUnderTest);
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toEqual(2);
//
//     Await testEngine.skipTopOfStack();
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [henWen] }, true);
//
//     Expect(henWen.zone).toBe("hand");
//   });
// });
//
