// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { iWontGiveIn } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   CalhounBattletested,
//   CandleheadDedicatedRacer,
//   FixitFelixJrPintsizedHero,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fix‐It Felix, Jr. - Pint‐Sized Hero", () => {
//   It("LET’S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can’t quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: iWontGiveIn.cost,
//       Discard: [candleheadDedicatedRacer],
//       Play: [fixitFelixJrPintsizedHero, calhounBattletested],
//       Hand: [iWontGiveIn],
//     });
//
//     Const cardFromDiscar = testEngine.getCardModel(candleheadDedicatedRacer);
//     Const actionInHand = testEngine.getCardModel(iWontGiveIn);
//     Const cardInPlay = testEngine.getCardModel(calhounBattletested);
//
//     Await testEngine.exertCard(cardInPlay);
//
//     Expect(cardInPlay.exerted).toBe(true);
//
//     Await testEngine.playCard(actionInHand);
//     Await testEngine.resolveTopOfStack({ targets: [cardFromDiscar] }, true);
//     Expect(cardFromDiscar.zone).toBe("hand");
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [cardInPlay] });
//
//     Expect(cardInPlay.exerted).toBe(false);
//
//     Expect(cardInPlay.hasQuestRestriction).toBe(true);
//   });
//
//   It("LET’S GET TO WORK GET TO WORK Try selecting a pilot to make ready from deck, I expect an exception", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: iWontGiveIn.cost,
//       Discard: [candleheadDedicatedRacer],
//       Play: [fixitFelixJrPintsizedHero],
//       Hand: [iWontGiveIn],
//       Deck: [calhounBattletested],
//     });
//
//     Const cardFromDiscar = testEngine.getCardModel(candleheadDedicatedRacer);
//     Const actionInHand = testEngine.getCardModel(iWontGiveIn);
//     Const cardInDeck = testEngine.getCardModel(calhounBattletested);
//
//     Await testEngine.exertCard(cardInDeck);
//
//     Expect(cardInDeck.exerted).toBe(true);
//
//     Await testEngine.playCard(actionInHand);
//     Await testEngine.resolveTopOfStack({ targets: [cardFromDiscar] }, true);
//
//     Expect(cardFromDiscar.zone).toBe("hand");
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
