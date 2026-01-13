// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { broadwaySturdyAndStrong } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Broadway - Sturdy and Strong", () => {
//   it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.) STONE BY DAY If you have 3 or more cards in your hand, this character can’t ready.", async () => {
//     const testEngine = new TestEngine({
//       play: [broadwaySturdyAndStrong],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(broadwaySturdyAndStrong);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
