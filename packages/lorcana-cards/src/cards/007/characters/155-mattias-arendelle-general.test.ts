// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ElsaIceMaker,
//   MattiasArendelleGeneral,
//   MickeyMouseInspirationalWarrior,
// } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mattias - Arendelle General", () => {
//   It("PROUD TO SERVE Your Queen characters gain Ward. (Opponents can't choose them except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [
//         MattiasArendelleGeneral,
//         ElsaIceMaker,
//         MickeyMouseInspirationalWarrior,
//       ],
//     });
//
//     Const queenCharacter = testEngine.getCardModel(elsaIceMaker);
//     Const nonQueenCharacter = testEngine.getCardModel(
//       MickeyMouseInspirationalWarrior,
//     );
//     Const mattias = testEngine.getCardModel(mattiasArendelleGeneral);
//
//     // Queen character should have Ward
//     Expect(queenCharacter.hasWard).toBe(true);
//
//     // Non-Queen character should not have Ward
//     Expect(nonQueenCharacter.hasWard).toBe(false);
//
//     // Mattias himself should not have Ward (ability targets "Your Queen characters", not self)
//     Expect(mattias.hasWard).toBe(false);
//   });
// });
//
