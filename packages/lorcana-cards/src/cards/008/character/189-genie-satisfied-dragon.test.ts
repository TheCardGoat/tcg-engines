// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { genieSatisfiedDragon } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Genie - Satisfied Dragon", () => {
//   it("BUG CATCHER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: genieSatisfiedDragon.cost,
//       play: [genieSatisfiedDragon],
//       hand: [],
//     });
//
//     expect(testEngine.getCardModel(genieSatisfiedDragon).hasEvasive).toBe(true);
//
//     await testEngine.passTurn();
//
//     expect(testEngine.getCardModel(genieSatisfiedDragon).hasEvasive).toBe(
//       false,
//     );
//   });
// });
//
