// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { butImMuchFaster } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("But I'm Much Faster", () => {
//   it("Chosen character gains Alert and Challenger +2 this turn", async () => {
//     const testEngine = new TestEngine({
//       inkwell: butImMuchFaster.cost,
//       hand: [butImMuchFaster],
//       play: [goofyKnightForADay],
//     });
//
//     const target = testEngine.getCardModel(goofyKnightForADay);
//
//     // Character should not have Alert (Evasive) or Challenger before playing the card
//     expect(target.hasAlert).toBe(false);
//     expect(target.hasChallenger).toBe(false);
//
//     await testEngine.playCard(butImMuchFaster, {
//       targets: [goofyKnightForADay],
//     });
//
//     // Character should have Alert (Evasive) and Challenger after playing the card
//     expect(target.hasAlert).toBe(true);
//     expect(target.hasChallenger).toBe(true);
//
//     // Pass turn to verify the effect expires
//     testEngine.passTurn();
//
//     // Character should lose Alert and Challenger at end of turn
//     expect(target.hasEvasive).toBe(false);
//     expect(target.hasChallenger).toBe(false);
//   });
// });
//
