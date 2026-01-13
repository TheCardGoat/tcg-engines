// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { nickWildePersistentInvestigator } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Nick Wilde - Persistent Investigator", () => {
//   it.skip("Shift 3 (You may pay 3 to play this on top of one of your characters named Nick Wilde.) CASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.", async () => {
//     const testEngine = new TestEngine({
//       play: [nickWildePersistentInvestigator],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       nickWildePersistentInvestigator,
//     );
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
