// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { broadwaySturdyAndStrong } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Broadway - Sturdy and Strong", () => {
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.) STONE BY DAY If you have 3 or more cards in your hand, this character can’t ready.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [broadwaySturdyAndStrong],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(broadwaySturdyAndStrong);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
