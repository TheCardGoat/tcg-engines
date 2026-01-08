// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { kaaHiddenSerpent } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Kaa - Hidden Serpent", () => {
//   describe("Evasive", () => {
//     it("should have Evasive ability", () => {
//       const testEngine = new TestEngine({
//         play: [kaaHiddenSerpent],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(kaaHiddenSerpent);
//       expect(cardUnderTest.hasEvasive).toBe(true);
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [kaaHiddenSerpent],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(kaaHiddenSerpent);
//
//       expect(cardUnderTest.strength).toBe(6);
//       expect(cardUnderTest.willpower).toBe(7);
//       expect(cardUnderTest.lore).toBe(3);
//       expect(cardUnderTest.cost).toBe(7);
//     });
//
//     it("should be inkwell card", () => {
//       expect(kaaHiddenSerpent.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(kaaHiddenSerpent.characteristics).toEqual([
//         "storyborn",
//         "villain",
//       ]);
//     });
//
//     it("should be emerald color", () => {
//       expect(kaaHiddenSerpent.colors).toEqual(["emerald"]);
//     });
//
//     it("should be uncommon rarity", () => {
//       expect(kaaHiddenSerpent.rarity).toBe("uncommon");
//     });
//
//     it("should be from SET 10", () => {
//       expect(kaaHiddenSerpent.set).toBe("010");
//     });
//
//     it("should be card number 79", () => {
//       expect(kaaHiddenSerpent.number).toBe(79);
//     });
//   });
//
//   describe("Gameplay", () => {
//     it("should be playable from hand", async () => {
//       const testEngine = new TestEngine({
//         inkwell: kaaHiddenSerpent.cost,
//         hand: [kaaHiddenSerpent],
//       });
//
//       const cardModel = testEngine.getCardModel(kaaHiddenSerpent);
//       expect(cardModel.zone).toBe("hand");
//
//       await testEngine.playCard(kaaHiddenSerpent);
//
//       expect(cardModel.zone).toBe("play");
//       expect(
//         testEngine.store.tableStore.getTable("player_one").inkAvailable(),
//       ).toBe(0);
//     });
//
//     it("should be able to quest for lore", async () => {
//       const testEngine = new TestEngine({
//         play: [kaaHiddenSerpent],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(kaaHiddenSerpent);
//       const initialLore =
//         testEngine.store.tableStore.getTable("player_one").lore;
//
//       cardUnderTest.quest();
//
//       expect(testEngine.store.tableStore.getTable("player_one").lore).toBe(
//         initialLore + 3,
//       );
//       expect(cardUnderTest.meta.exerted).toBe(true);
//     });
//
//     it("should be able to be used as ink", async () => {
//       const testEngine = new TestEngine({
//         hand: [kaaHiddenSerpent],
//       });
//
//       const cardModel = testEngine.getCardModel(kaaHiddenSerpent);
//       expect(cardModel.zone).toBe("hand");
//       expect(cardModel.lorcanitoCard.inkwell).toBe(true);
//
//       const initialInkwellSize =
//         testEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//           .length;
//
//       cardModel.addToInkwell();
//
//       expect(cardModel.zone).toBe("inkwell");
//       expect(
//         testEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//           .length,
//       ).toBe(initialInkwellSize + 1);
//     });
//   });
// });
//
