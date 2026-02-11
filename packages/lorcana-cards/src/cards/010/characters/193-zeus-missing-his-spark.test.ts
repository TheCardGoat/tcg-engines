// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { zeusMissingHisSpark } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Zeus - Missing His Spark", () => {
//   It("Boost 2 (Once during your turn, you may pay 2 to put the top card of your deck facedown under this character.) ", async () => {
//     Const testEngine = new TestEngine({
//       Play: [zeusMissingHisSpark],
//     });
//
//     Expect(testEngine.getCardModel(zeusMissingHisSpark).hasBoost).toBe(true);
//   });
//
//   It("I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W} - with boost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 5,
//       Deck: [moanaOfMotunui],
//       Play: [zeusMissingHisSpark],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(zeusMissingHisSpark);
//
//     // Before boost, Zeus should have base stats
//     Expect(cardUnderTest.strength).toBe(zeusMissingHisSpark.strength);
//     Expect(cardUnderTest.willpower).toBe(zeusMissingHisSpark.willpower);
//     Expect(cardUnderTest.cardsUnder).toHaveLength(0);
//
//     // Use boost to put a card under Zeus
//     Await testEngine.activateCard(zeusMissingHisSpark);
//
//     // Verify card was placed under Zeus
//     Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//     Const boostedCard = testEngine.getCardModel(moanaOfMotunui);
//     Expect(boostedCard.isUnder(cardUnderTest)).toBe(true);
//
//     // After boost, Zeus should have +2 strength and +2 willpower
//     Expect(cardUnderTest.strength).toBe(zeusMissingHisSpark.strength + 2);
//     Expect(cardUnderTest.willpower).toBe(zeusMissingHisSpark.willpower + 2);
//   });
//
//   It("I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W} - without boost", async () => {
//     Const testEngine = new TestEngine({
//       Play: [zeusMissingHisSpark],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(zeusMissingHisSpark);
//
//     // Without a card under Zeus, he should have base stats
//     Expect(cardUnderTest.strength).toBe(zeusMissingHisSpark.strength);
//     Expect(cardUnderTest.willpower).toBe(zeusMissingHisSpark.willpower);
//   });
// });
//
