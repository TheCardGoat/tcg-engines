// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { blueFairyGuidingLight } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Blue Fairy - Guiding Light", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [blueFairyGuidingLight],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(blueFairyGuidingLight);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [blueFairyGuidingLight],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(blueFairyGuidingLight);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
