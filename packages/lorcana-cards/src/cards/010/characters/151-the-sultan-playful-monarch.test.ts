// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theSultanPlayfulMonarch } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Sultan - Playful Monarch", () => {
//   Describe("Vanilla character", () => {
//     It("should have no special abilities", () => {
//       Expect(theSultanPlayfulMonarch.abilities).toEqual([]);
//     });
//
//     It("should be playable", () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theSultanPlayfulMonarch.cost,
//         Hand: [theSultanPlayfulMonarch],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(theSultanPlayfulMonarch);
//       Expect(cardUnderTest.zone).toBe("hand");
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [theSultanPlayfulMonarch],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(theSultanPlayfulMonarch);
//
//       Expect(cardUnderTest.strength).toBe(1);
//       Expect(cardUnderTest.willpower).toBe(1);
//       Expect(cardUnderTest.lore).toBe(2);
//       Expect(cardUnderTest.cost).toBe(1);
//     });
//
//     It("should not be inkwell card", () => {
//       Expect(theSultanPlayfulMonarch.inkwell).toBe(false);
//     });
//
//     It("should have correct characteristics for synergy", () => {
//       Expect(theSultanPlayfulMonarch.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "king",
//       ]);
//     });
//
//     It("should be sapphire color", () => {
//       Expect(theSultanPlayfulMonarch.colors).toEqual(["sapphire"]);
//     });
//
//     It("should be rare rarity", () => {
//       Expect(theSultanPlayfulMonarch.rarity).toBe("rare");
//     });
//   });
// });
//
