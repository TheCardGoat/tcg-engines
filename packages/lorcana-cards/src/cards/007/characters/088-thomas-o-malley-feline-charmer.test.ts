// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { thomasOmalleyFelineCharmer } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Thomas O'malley - Feline Charmer", () => {
//   it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     const testEngine = new TestEngine({
//       play: [thomasOmalleyFelineCharmer],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(thomasOmalleyFelineCharmer);
//     expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
