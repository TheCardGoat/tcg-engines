// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { thomasOmalleyFelineCharmer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Thomas O'malley - Feline Charmer", () => {
//   It.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [thomasOmalleyFelineCharmer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(thomasOmalleyFelineCharmer);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
