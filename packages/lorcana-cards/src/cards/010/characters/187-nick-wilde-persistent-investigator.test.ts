// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { nickWildePersistentInvestigator } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nick Wilde - Persistent Investigator", () => {
//   It.skip("Shift 3 (You may pay 3 to play this on top of one of your characters named Nick Wilde.) CASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [nickWildePersistentInvestigator],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       NickWildePersistentInvestigator,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
