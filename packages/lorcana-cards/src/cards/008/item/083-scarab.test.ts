// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PalaceGuardSpectralSentry,
//   Scarab,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scarab", () => {
//   It("SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 2,
//       Play: [scarab],
//       Discard: [palaceGuardSpectralSentry],
//     });
//
//     Await testEngine.activateCard(scarab, {
//       Targets: [palaceGuardSpectralSentry],
//     });
//
//     Expect(testEngine.getCardModel(palaceGuardSpectralSentry).zone).toBe(
//       "hand",
//     );
//   });
// });
//
