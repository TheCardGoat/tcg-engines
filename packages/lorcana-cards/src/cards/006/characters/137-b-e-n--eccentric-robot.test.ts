// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { benEccentricRobot } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("B.E.N. - Eccentric Robot", () => {
//   It.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [benEccentricRobot],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(benEccentricRobot);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
