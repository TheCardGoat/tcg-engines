// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { duckworthGhostButler } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Duckworth - Ghost Butler", () => {
//   It.skip("Rush (This character can challenge the turn they're played.) FINAL ACT During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [duckworthGhostButler],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(duckworthGhostButler);
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
