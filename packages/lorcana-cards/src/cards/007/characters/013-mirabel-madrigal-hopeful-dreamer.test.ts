// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mirabelMadrigalHopefulDreamer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mirabel Madrigal - Hopeful Dreamer", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.) Singer 5 (This character counts as cost 5 to sing songs.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mirabelMadrigalHopefulDreamer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       MirabelMadrigalHopefulDreamer,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
