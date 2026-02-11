// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { auroraTranquilPrincess } from "@lorcanito/lorcana-engine/cards/004/characters/141-aurora-tranquil-princess";
// Import { beastGraciousPrince } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Beast - Gracious Prince", () => {
//   It("FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: beastGraciousPrince.cost,
//       Play: [beastGraciousPrince, auroraTranquilPrincess],
//     });
//
//     Const target = testEngine.getCardModel(auroraTranquilPrincess);
//
//     Expect(target.willpower).toBe(auroraTranquilPrincess.willpower + 1);
//     Expect(target.strength).toBe(auroraTranquilPrincess.strength + 1);
//   });
// });
//
