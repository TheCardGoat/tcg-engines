// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   arielEtherealVoice,
//   dellasMoonLullaby,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ariel - Ethereal Voice", () => {
//   it("Boost 1 (Once during your turn, you may pay 1 to put the top card of your deck facedown under this character.) ", async () => {
//     const testEngine = new TestEngine({
//       play: [arielEtherealVoice],
//     });
//
//     expect(testEngine.getCardModel(arielEtherealVoice).hasBoost).toBe(true);
//   });
// });
//
