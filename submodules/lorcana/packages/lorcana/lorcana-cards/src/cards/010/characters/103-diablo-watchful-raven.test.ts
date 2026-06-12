// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { diabloWatchfulRaven } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Diablo - Watchful Raven", () => {
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [diabloWatchfulRaven],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(diabloWatchfulRaven);
//
//       Expect(cardUnderTest.strength).toBe(3);
//       Expect(cardUnderTest.willpower).toBe(3);
//       Expect(cardUnderTest.lore).toBe(2);
//       Expect(cardUnderTest.cost).toBe(2);
//     });
//
//     It("should not be inkwell card", () => {
//       Expect(diabloWatchfulRaven.inkwell).toBe(false);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(diabloWatchfulRaven.characteristics).toEqual([
//         "storyborn",
//         "ally",
//       ]);
//     });
//
//     It("should be ruby color", () => {
//       Expect(diabloWatchfulRaven.colors).toEqual(["ruby"]);
//     });
//   });
//
//   Describe("Gameplay", () => {
//     It("should be playable from hand", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: diabloWatchfulRaven.cost,
//         Hand: [diabloWatchfulRaven],
//       });
//
//       Await testEngine.playCard(diabloWatchfulRaven);
//
//       Const cardUnderTest = testEngine.getCardModel(diabloWatchfulRaven);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("should be able to quest when ready", () => {
//       Const testEngine = new TestEngine({
//         Play: [diabloWatchfulRaven],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(diabloWatchfulRaven);
//       CardUnderTest.updateCardMeta({ exerted: false });
//
//       CardUnderTest.quest();
//
//       Expect(cardUnderTest.ready).toBe(false);
//     });
//   });
// });
//
