// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { genieOnTheJob } from "@lorcanito/lorcana-engine/cards/001/characters/075-genie-on-the-job.ts";
// import { kingCandySovereignOfSugar } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { flynnRiderSpectralScoundrel } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Flynn Rider - Spectral Scoundrel", () => {
//   it("Boost 2 (Once during your turn, you may pay 2 to put the top card of your deck facedown under this character.) I'LL TAKE THAT While there's a card under this character, he gets +2 and +1. ", async () => {
//     const testEngine = new TestEngine({
//       play: [flynnRiderSpectralScoundrel],
//     });
//
//     expect(testEngine.getCardModel(flynnRiderSpectralScoundrel).hasBoost).toBe(
//       true,
//     );
//   });
//
//   it("Boost: places the top card under Flynn and grants +2 strength and +1 lore while present", async () => {
//     const topCard = kingCandySovereignOfSugar;
//
//     const testEngine = new TestEngine({
//       inkwell: 2,
//       deck: [topCard],
//       play: [flynnRiderSpectralScoundrel],
//     });
//
//     const modelBefore = testEngine.getCardModel(flynnRiderSpectralScoundrel);
//
//     // base stats
//     expect(modelBefore.strength).toEqual(flynnRiderSpectralScoundrel.strength);
//     expect(modelBefore.lore).toEqual(flynnRiderSpectralScoundrel.lore);
//
//     await testEngine.activateCard(flynnRiderSpectralScoundrel);
//
//     const modelAfter = testEngine.getCardModel(flynnRiderSpectralScoundrel);
//
//     // a card should be under Flynn
//     expect(modelAfter.cardsUnder).toHaveLength(1);
//
//     // buffs applied while card under
//     expect(modelAfter.strength).toEqual(
//       flynnRiderSpectralScoundrel.strength + 2,
//     );
//     expect(modelAfter.lore).toEqual(flynnRiderSpectralScoundrel.lore + 1);
//   });
//
//   it("Buffs are removed when the card under Flynn leaves (return to hand)", async () => {
//     const topCard = kingCandySovereignOfSugar;
//
//     const testEngine = new TestEngine({
//       inkwell: 2 + genieOnTheJob.cost,
//       deck: [topCard],
//       hand: [genieOnTheJob],
//       play: [flynnRiderSpectralScoundrel],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(flynnRiderSpectralScoundrel);
//
//     // activate boost to put top card under Flynn
//     await testEngine.activateCard(flynnRiderSpectralScoundrel);
//
//     expect(cardUnderTest.cardsUnder).toHaveLength(1);
//     expect(cardUnderTest.strength).toEqual(
//       flynnRiderSpectralScoundrel.strength + 2,
//     );
//     expect(cardUnderTest.lore).toEqual(flynnRiderSpectralScoundrel.lore + 1);
//
//     // Play genie which (in tests elsewhere) returns Flynn to hand with its under cards
//     await testEngine.playCard(genieOnTheJob);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     // Flynn (and the card under him) should be back in hand and buffs no longer apply
//     expect(cardUnderTest.zone).toEqual("hand");
//     expect(cardUnderTest.cardsUnder).toHaveLength(0);
//     expect(cardUnderTest.strength).toEqual(
//       flynnRiderSpectralScoundrel.strength,
//     );
//     expect(cardUnderTest.lore).toEqual(flynnRiderSpectralScoundrel.lore);
//   });
// });
//
