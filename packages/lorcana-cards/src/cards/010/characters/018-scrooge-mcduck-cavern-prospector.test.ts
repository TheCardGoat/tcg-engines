// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import {
//   gastonFrightfulBully,
//   scroogeMcduckCavernProspector,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Scrooge McDuck - Cavern Prospector", () => {
//   it("Has Shift 4 ability", async () => {
//     const testEngine = new TestEngine({
//       play: [scroogeMcduckCavernProspector],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       scroogeMcduckCavernProspector,
//     );
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("SPECULATION Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gastonFrightfulBully.cost,
//       hand: [gastonFrightfulBully],
//       play: [scroogeMcduckCavernProspector],
//       deck: [goofyKnightForADay],
//     });
//
//     const topCard = testEngine.getCardModel(goofyKnightForADay);
//     const targetCard = testEngine.getCardModel(gastonFrightfulBully);
//
//     await testEngine.playCard(gastonFrightfulBully);
//     await testEngine.acceptOptionalLayer();
//
//     expect(targetCard.cardsUnder).toHaveLength(1);
//     expect(topCard.isUnder(targetCard)).toBe(true);
//   });
// });
//
