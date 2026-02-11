// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { genieSatisfiedDragon } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Genie - Satisfied Dragon", () => {
//   It("BUG CATCHER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: genieSatisfiedDragon.cost,
//       Play: [genieSatisfiedDragon],
//       Hand: [],
//     });
//
//     Expect(testEngine.getCardModel(genieSatisfiedDragon).hasEvasive).toBe(true);
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(genieSatisfiedDragon).hasEvasive).toBe(
//       False,
//     );
//   });
// });
//
