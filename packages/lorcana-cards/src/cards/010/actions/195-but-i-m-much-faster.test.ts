// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { butImMuchFaster } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("But I'm Much Faster", () => {
//   It("Chosen character gains Alert and Challenger +2 this turn", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: butImMuchFaster.cost,
//       Hand: [butImMuchFaster],
//       Play: [goofyKnightForADay],
//     });
//
//     Const target = testEngine.getCardModel(goofyKnightForADay);
//
//     // Character should not have Alert (Evasive) or Challenger before playing the card
//     Expect(target.hasAlert).toBe(false);
//     Expect(target.hasChallenger).toBe(false);
//
//     Await testEngine.playCard(butImMuchFaster, {
//       Targets: [goofyKnightForADay],
//     });
//
//     // Character should have Alert (Evasive) and Challenger after playing the card
//     Expect(target.hasAlert).toBe(true);
//     Expect(target.hasChallenger).toBe(true);
//
//     // Pass turn to verify the effect expires
//     TestEngine.passTurn();
//
//     // Character should lose Alert and Challenger at end of turn
//     Expect(target.hasEvasive).toBe(false);
//     Expect(target.hasChallenger).toBe(false);
//   });
// });
//
