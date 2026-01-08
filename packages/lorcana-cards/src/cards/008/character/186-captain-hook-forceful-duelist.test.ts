// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { captainHookForcefulDuelist } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Captain Hook - Forceful Duelist", () => {
//   it("Challenger +2 (While challenging, this character gets +2 {S}.)", async () => {
//     const testEngine = new TestEngine({
//       play: [captainHookForcefulDuelist],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(captainHookForcefulDuelist);
//     expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
