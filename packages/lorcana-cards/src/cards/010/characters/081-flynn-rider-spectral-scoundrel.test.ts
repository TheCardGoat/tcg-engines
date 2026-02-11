// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { genieOnTheJob } from "@lorcanito/lorcana-engine/cards/001/characters/075-genie-on-the-job.ts";
// Import { kingCandySovereignOfSugar } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { flynnRiderSpectralScoundrel } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Flynn Rider - Spectral Scoundrel", () => {
//   It("Boost 2 (Once during your turn, you may pay 2 to put the top card of your deck facedown under this character.) I'LL TAKE THAT While there's a card under this character, he gets +2 and +1. ", async () => {
//     Const testEngine = new TestEngine({
//       Play: [flynnRiderSpectralScoundrel],
//     });
//
//     Expect(testEngine.getCardModel(flynnRiderSpectralScoundrel).hasBoost).toBe(
//       True,
//     );
//   });
//
//   It("Boost: places the top card under Flynn and grants +2 strength and +1 lore while present", async () => {
//     Const topCard = kingCandySovereignOfSugar;
//
//     Const testEngine = new TestEngine({
//       Inkwell: 2,
//       Deck: [topCard],
//       Play: [flynnRiderSpectralScoundrel],
//     });
//
//     Const modelBefore = testEngine.getCardModel(flynnRiderSpectralScoundrel);
//
//     // base stats
//     Expect(modelBefore.strength).toEqual(flynnRiderSpectralScoundrel.strength);
//     Expect(modelBefore.lore).toEqual(flynnRiderSpectralScoundrel.lore);
//
//     Await testEngine.activateCard(flynnRiderSpectralScoundrel);
//
//     Const modelAfter = testEngine.getCardModel(flynnRiderSpectralScoundrel);
//
//     // a card should be under Flynn
//     Expect(modelAfter.cardsUnder).toHaveLength(1);
//
//     // buffs applied while card under
//     Expect(modelAfter.strength).toEqual(
//       FlynnRiderSpectralScoundrel.strength + 2,
//     );
//     Expect(modelAfter.lore).toEqual(flynnRiderSpectralScoundrel.lore + 1);
//   });
//
//   It("Buffs are removed when the card under Flynn leaves (return to hand)", async () => {
//     Const topCard = kingCandySovereignOfSugar;
//
//     Const testEngine = new TestEngine({
//       Inkwell: 2 + genieOnTheJob.cost,
//       Deck: [topCard],
//       Hand: [genieOnTheJob],
//       Play: [flynnRiderSpectralScoundrel],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(flynnRiderSpectralScoundrel);
//
//     // activate boost to put top card under Flynn
//     Await testEngine.activateCard(flynnRiderSpectralScoundrel);
//
//     Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//     Expect(cardUnderTest.strength).toEqual(
//       FlynnRiderSpectralScoundrel.strength + 2,
//     );
//     Expect(cardUnderTest.lore).toEqual(flynnRiderSpectralScoundrel.lore + 1);
//
//     // Play genie which (in tests elsewhere) returns Flynn to hand with its under cards
//     Await testEngine.playCard(genieOnTheJob);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     // Flynn (and the card under him) should be back in hand and buffs no longer apply
//     Expect(cardUnderTest.zone).toEqual("hand");
//     Expect(cardUnderTest.cardsUnder).toHaveLength(0);
//     Expect(cardUnderTest.strength).toEqual(
//       FlynnRiderSpectralScoundrel.strength,
//     );
//     Expect(cardUnderTest.lore).toEqual(flynnRiderSpectralScoundrel.lore);
//   });
// });
//
