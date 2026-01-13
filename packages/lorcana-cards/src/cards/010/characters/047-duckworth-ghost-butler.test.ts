// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { duckworthGhostButler } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Duckworth - Ghost Butler", () => {
//   it.skip("Rush (This character can challenge the turn they're played.) FINAL ACT During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.", async () => {
//     const testEngine = new TestEngine({
//       play: [duckworthGhostButler],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(duckworthGhostButler);
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
