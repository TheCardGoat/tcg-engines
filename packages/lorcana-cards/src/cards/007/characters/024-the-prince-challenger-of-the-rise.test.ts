// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { thePrinceChallengerOfTheRise } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Prince - Challenger of the Rise", () => {
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [thePrinceChallengerOfTheRise],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(thePrinceChallengerOfTheRise);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
