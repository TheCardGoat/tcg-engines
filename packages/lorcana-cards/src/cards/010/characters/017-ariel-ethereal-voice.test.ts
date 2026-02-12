// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielEtherealVoice,
//   DellasMoonLullaby,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ariel - Ethereal Voice", () => {
//   It("Boost 1 (Once during your turn, you may pay 1 to put the top card of your deck facedown under this character.) ", async () => {
//     Const testEngine = new TestEngine({
//       Play: [arielEtherealVoice],
//     });
//
//     Expect(testEngine.getCardModel(arielEtherealVoice).hasBoost).toBe(true);
//   });
// });
//
