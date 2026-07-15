// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import {
//   GastonFrightfulBully,
//   ScroogeMcduckCavernProspector,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scrooge McDuck - Cavern Prospector", () => {
//   It("Has Shift 4 ability", async () => {
//     Const testEngine = new TestEngine({
//       Play: [scroogeMcduckCavernProspector],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       ScroogeMcduckCavernProspector,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("SPECULATION Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gastonFrightfulBully.cost,
//       Hand: [gastonFrightfulBully],
//       Play: [scroogeMcduckCavernProspector],
//       Deck: [goofyKnightForADay],
//     });
//
//     Const topCard = testEngine.getCardModel(goofyKnightForADay);
//     Const targetCard = testEngine.getCardModel(gastonFrightfulBully);
//
//     Await testEngine.playCard(gastonFrightfulBully);
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(targetCard.cardsUnder).toHaveLength(1);
//     Expect(topCard.isUnder(targetCard)).toBe(true);
//   });
// });
//
