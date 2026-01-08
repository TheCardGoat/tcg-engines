// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { theSultanPlayfulMonarch } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Sultan - Playful Monarch", () => {
//   describe("Vanilla character", () => {
//     it("should have no special abilities", () => {
//       expect(theSultanPlayfulMonarch.abilities).toEqual([]);
//     });
//
//     it("should be playable", () => {
//       const testEngine = new TestEngine({
//         inkwell: theSultanPlayfulMonarch.cost,
//         hand: [theSultanPlayfulMonarch],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(theSultanPlayfulMonarch);
//       expect(cardUnderTest.zone).toBe("hand");
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [theSultanPlayfulMonarch],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(theSultanPlayfulMonarch);
//
//       expect(cardUnderTest.strength).toBe(1);
//       expect(cardUnderTest.willpower).toBe(1);
//       expect(cardUnderTest.lore).toBe(2);
//       expect(cardUnderTest.cost).toBe(1);
//     });
//
//     it("should not be inkwell card", () => {
//       expect(theSultanPlayfulMonarch.inkwell).toBe(false);
//     });
//
//     it("should have correct characteristics for synergy", () => {
//       expect(theSultanPlayfulMonarch.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "king",
//       ]);
//     });
//
//     it("should be sapphire color", () => {
//       expect(theSultanPlayfulMonarch.colors).toEqual(["sapphire"]);
//     });
//
//     it("should be rare rarity", () => {
//       expect(theSultanPlayfulMonarch.rarity).toBe("rare");
//     });
//   });
// });
//
