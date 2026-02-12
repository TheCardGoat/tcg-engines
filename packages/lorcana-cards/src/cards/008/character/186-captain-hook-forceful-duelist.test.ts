// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { captainHookForcefulDuelist } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Captain Hook - Forceful Duelist", () => {
//   It("Challenger +2 (While challenging, this character gets +2 {S}.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [captainHookForcefulDuelist],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(captainHookForcefulDuelist);
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
