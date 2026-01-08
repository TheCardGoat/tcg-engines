// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { diabloWatchfulRaven } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Diablo - Watchful Raven", () => {
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [diabloWatchfulRaven],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(diabloWatchfulRaven);
//
//       expect(cardUnderTest.strength).toBe(3);
//       expect(cardUnderTest.willpower).toBe(3);
//       expect(cardUnderTest.lore).toBe(2);
//       expect(cardUnderTest.cost).toBe(2);
//     });
//
//     it("should not be inkwell card", () => {
//       expect(diabloWatchfulRaven.inkwell).toBe(false);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(diabloWatchfulRaven.characteristics).toEqual([
//         "storyborn",
//         "ally",
//       ]);
//     });
//
//     it("should be ruby color", () => {
//       expect(diabloWatchfulRaven.colors).toEqual(["ruby"]);
//     });
//   });
//
//   describe("Gameplay", () => {
//     it("should be playable from hand", async () => {
//       const testEngine = new TestEngine({
//         inkwell: diabloWatchfulRaven.cost,
//         hand: [diabloWatchfulRaven],
//       });
//
//       await testEngine.playCard(diabloWatchfulRaven);
//
//       const cardUnderTest = testEngine.getCardModel(diabloWatchfulRaven);
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("should be able to quest when ready", () => {
//       const testEngine = new TestEngine({
//         play: [diabloWatchfulRaven],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(diabloWatchfulRaven);
//       cardUnderTest.updateCardMeta({ exerted: false });
//
//       cardUnderTest.quest();
//
//       expect(cardUnderTest.ready).toBe(false);
//     });
//   });
// });
//
