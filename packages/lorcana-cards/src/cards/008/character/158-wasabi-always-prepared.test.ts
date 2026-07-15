// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { wasabiAlwaysPrepared } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wasabi - Always Prepared", () => {
//   It.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [wasabiAlwaysPrepared],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(wasabiAlwaysPrepared);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
