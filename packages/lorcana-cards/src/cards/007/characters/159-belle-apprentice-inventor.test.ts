// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   belleApprenticeInventor,
//   spaghettiDinner,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Belle - Apprentice Inventor", () => {
//   it("WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 0,
//       play: [spaghettiDinner],
//       hand: [belleApprenticeInventor],
//     });
//
//     await testEngine.playCard(belleApprenticeInventor, {
//       alternativeCosts: [spaghettiDinner],
//     });
//
//     expect(testEngine.getCardModel(spaghettiDinner).zone).toBe("discard");
//     expect(testEngine.getCardModel(belleApprenticeInventor).zone).toBe("play");
//   });
// });
//
