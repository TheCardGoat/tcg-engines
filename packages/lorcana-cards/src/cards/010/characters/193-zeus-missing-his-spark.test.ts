// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { zeusMissingHisSpark } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Zeus - Missing His Spark", () => {
//   it("Boost 2 (Once during your turn, you may pay 2 to put the top card of your deck facedown under this character.) ", async () => {
//     const testEngine = new TestEngine({
//       play: [zeusMissingHisSpark],
//     });
//
//     expect(testEngine.getCardModel(zeusMissingHisSpark).hasBoost).toBe(true);
//   });
//
//   it("I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W} - with boost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 5,
//       deck: [moanaOfMotunui],
//       play: [zeusMissingHisSpark],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(zeusMissingHisSpark);
//
//     // Before boost, Zeus should have base stats
//     expect(cardUnderTest.strength).toBe(zeusMissingHisSpark.strength);
//     expect(cardUnderTest.willpower).toBe(zeusMissingHisSpark.willpower);
//     expect(cardUnderTest.cardsUnder).toHaveLength(0);
//
//     // Use boost to put a card under Zeus
//     await testEngine.activateCard(zeusMissingHisSpark);
//
//     // Verify card was placed under Zeus
//     expect(cardUnderTest.cardsUnder).toHaveLength(1);
//     const boostedCard = testEngine.getCardModel(moanaOfMotunui);
//     expect(boostedCard.isUnder(cardUnderTest)).toBe(true);
//
//     // After boost, Zeus should have +2 strength and +2 willpower
//     expect(cardUnderTest.strength).toBe(zeusMissingHisSpark.strength + 2);
//     expect(cardUnderTest.willpower).toBe(zeusMissingHisSpark.willpower + 2);
//   });
//
//   it("I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W} - without boost", async () => {
//     const testEngine = new TestEngine({
//       play: [zeusMissingHisSpark],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(zeusMissingHisSpark);
//
//     // Without a card under Zeus, he should have base stats
//     expect(cardUnderTest.strength).toBe(zeusMissingHisSpark.strength);
//     expect(cardUnderTest.willpower).toBe(zeusMissingHisSpark.willpower);
//   });
// });
//
