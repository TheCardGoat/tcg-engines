// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GadgetHackwrenchCreativeThinker,
//   MrBigShrewdTycoon,
//   TukTukBigBuddy,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mr. Big - Shrewd Tycoon", () => {
//   It("REPUTATION This character can't be challenged by characters with 2 {S} or more.", async () => {
//     Const cardWithOneStr = gadgetHackwrenchCreativeThinker;
//     Const cardWith6Str = tukTukBigBuddy;
//
//     Const testEngine = new TestEngine(
//       {
//         Play: [cardWithOneStr, cardWith6Str],
//       },
//       {
//         Play: [mrBigShrewdTycoon],
//       },
//     );
//
//     Await testEngine.tapCard(mrBigShrewdTycoon);
//
//     Expect(
//       TestEngine
//         .getCardModel(cardWithOneStr)
//         .canChallenge(testEngine.getCardModel(mrBigShrewdTycoon)),
//     ).toEqual(true);
//     Expect(
//       TestEngine
//         .getCardModel(cardWith6Str)
//         .canChallenge(testEngine.getCardModel(mrBigShrewdTycoon)),
//     ).toEqual(false);
//   });
// });
//
