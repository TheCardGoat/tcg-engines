// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { kaaHiddenSerpent } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kaa - Hidden Serpent", () => {
//   Describe("Evasive", () => {
//     It("should have Evasive ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [kaaHiddenSerpent],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(kaaHiddenSerpent);
//       Expect(cardUnderTest.hasEvasive).toBe(true);
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [kaaHiddenSerpent],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(kaaHiddenSerpent);
//
//       Expect(cardUnderTest.strength).toBe(6);
//       Expect(cardUnderTest.willpower).toBe(7);
//       Expect(cardUnderTest.lore).toBe(3);
//       Expect(cardUnderTest.cost).toBe(7);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(kaaHiddenSerpent.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(kaaHiddenSerpent.characteristics).toEqual([
//         "storyborn",
//         "villain",
//       ]);
//     });
//
//     It("should be emerald color", () => {
//       Expect(kaaHiddenSerpent.colors).toEqual(["emerald"]);
//     });
//
//     It("should be uncommon rarity", () => {
//       Expect(kaaHiddenSerpent.rarity).toBe("uncommon");
//     });
//
//     It("should be from SET 10", () => {
//       Expect(kaaHiddenSerpent.set).toBe("010");
//     });
//
//     It("should be card number 79", () => {
//       Expect(kaaHiddenSerpent.number).toBe(79);
//     });
//   });
//
//   Describe("Gameplay", () => {
//     It("should be playable from hand", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: kaaHiddenSerpent.cost,
//         Hand: [kaaHiddenSerpent],
//       });
//
//       Const cardModel = testEngine.getCardModel(kaaHiddenSerpent);
//       Expect(cardModel.zone).toBe("hand");
//
//       Await testEngine.playCard(kaaHiddenSerpent);
//
//       Expect(cardModel.zone).toBe("play");
//       Expect(
//         TestEngine.store.tableStore.getTable("player_one").inkAvailable(),
//       ).toBe(0);
//     });
//
//     It("should be able to quest for lore", async () => {
//       Const testEngine = new TestEngine({
//         Play: [kaaHiddenSerpent],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(kaaHiddenSerpent);
//       Const initialLore =
//         TestEngine.store.tableStore.getTable("player_one").lore;
//
//       CardUnderTest.quest();
//
//       Expect(testEngine.store.tableStore.getTable("player_one").lore).toBe(
//         InitialLore + 3,
//       );
//       Expect(cardUnderTest.meta.exerted).toBe(true);
//     });
//
//     It("should be able to be used as ink", async () => {
//       Const testEngine = new TestEngine({
//         Hand: [kaaHiddenSerpent],
//       });
//
//       Const cardModel = testEngine.getCardModel(kaaHiddenSerpent);
//       Expect(cardModel.zone).toBe("hand");
//       Expect(cardModel.lorcanitoCard.inkwell).toBe(true);
//
//       Const initialInkwellSize =
//         TestEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//           .length;
//
//       CardModel.addToInkwell();
//
//       Expect(cardModel.zone).toBe("inkwell");
//       Expect(
//         TestEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//           .length,
//       ).toBe(initialInkwellSize + 1);
//     });
//   });
// });
//
