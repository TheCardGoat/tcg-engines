// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   elsaIceMaker,
//   mattiasArendelleGeneral,
//   mickeyMouseInspirationalWarrior,
// } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mattias - Arendelle General", () => {
//   it("PROUD TO SERVE Your Queen characters gain Ward. (Opponents can't choose them except to challenge.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [
//         mattiasArendelleGeneral,
//         elsaIceMaker,
//         mickeyMouseInspirationalWarrior,
//       ],
//     });
//
//     const queenCharacter = testEngine.getCardModel(elsaIceMaker);
//     const nonQueenCharacter = testEngine.getCardModel(
//       mickeyMouseInspirationalWarrior,
//     );
//     const mattias = testEngine.getCardModel(mattiasArendelleGeneral);
//
//     // Queen character should have Ward
//     expect(queenCharacter.hasWard).toBe(true);
//
//     // Non-Queen character should not have Ward
//     expect(nonQueenCharacter.hasWard).toBe(false);
//
//     // Mattias himself should not have Ward (ability targets "Your Queen characters", not self)
//     expect(mattias.hasWard).toBe(false);
//   });
// });
//
