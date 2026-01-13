// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { thePrinceChallengerOfTheRise } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Prince - Challenger of the Rise", () => {
//   it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [thePrinceChallengerOfTheRise],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(thePrinceChallengerOfTheRise);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
