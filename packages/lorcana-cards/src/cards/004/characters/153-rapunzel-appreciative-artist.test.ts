// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PascalInquisitivePet,
//   RapunzelAppreciativeArtist,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rapunzel - Appreciative Artist", () => {
//   It("**PERCEPTIVE PARTNER** While you have a character named Pascal in play, this character gains **Ward.** _(Opponents can't chose them except to challenge.)_", async () => {
//     // Setup test with only Rapunzel in play
//     Const testEngine = new TestEngine({
//       Inkwell: rapunzelAppreciativeArtist.cost,
//       Play: [rapunzelAppreciativeArtist],
//     });
//
//     Const rapunzelCard = testEngine.getCardModel(rapunzelAppreciativeArtist);
//
//     // Test initial state (without Pascal)
//     Expect(rapunzelCard.hasWard).toBe(false);
//
//     // Setup test with both Rapunzel and Pascal in play
//     Const testEngineWithPascal = new TestEngine({
//       Inkwell: rapunzelAppreciativeArtist.cost,
//       Play: [rapunzelAppreciativeArtist, pascalInquisitivePet],
//     });
//
//     Const rapunzelCardWithPascal = testEngineWithPascal.getCardModel(
//       RapunzelAppreciativeArtist,
//     );
//
//     // Test state with Pascal in play
//     Expect(rapunzelCardWithPascal.hasWard).toBe(true);
//   });
// });
//
