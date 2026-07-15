// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChipRangerLeader,
//   DaleFriendInNeed,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chip - Ranger Leader", () => {
//   Describe("**THE VALUE OF FRIENDSHIP** While you have a character named Dale in play, this character gains **Support**. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_", () => {
//     It("should have support when Dale is in play", async () => {
//       Const testEngine = new TestEngine({
//         Play: [chipRangerLeader, daleFriendInNeed],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(chipRangerLeader);
//
//       Expect(cardUnderTest.hasSupport).toBe(true);
//     });
//
//     It("should not have support when Dale is not in play", async () => {
//       Const testEngine = new TestEngine({
//         Play: [chipRangerLeader],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(chipRangerLeader);
//
//       Expect(cardUnderTest.hasSupport).toBe(false);
//     });
//   });
// });
//
