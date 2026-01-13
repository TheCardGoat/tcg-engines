// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { brooklynSecondInCommand } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Brooklyn - Second in Command", () => {
//   describe("Evasive", () => {
//     it("should have Evasive ability", () => {
//       const testEngine = new TestEngine({
//         play: [brooklynSecondInCommand],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(brooklynSecondInCommand);
//       expect(cardUnderTest.hasEvasive).toBe(true);
//     });
//   });
//
//   describe("STONE BY DAY - If you have 3 or more cards in your hand, this character can't ready", () => {
//     it("should have the STONE BY DAY ability defined", () => {
//       const stoneByDay = brooklynSecondInCommand.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       expect(stoneByDay).toBeDefined();
//
//       if (
//         stoneByDay &&
//         "conditions" in stoneByDay &&
//         Array.isArray(stoneByDay.conditions)
//       ) {
//         // Should have condition checking hand count >= 3
//         expect(stoneByDay.conditions).toHaveLength(1);
//         const condition = stoneByDay.conditions[0] as any;
//         expect(condition.type).toBe("filter");
//         expect(condition.comparison.operator).toBe("gte");
//         expect(condition.comparison.value).toBe(3);
//       }
//
//       if (
//         stoneByDay &&
//         "effects" in stoneByDay &&
//         Array.isArray(stoneByDay.effects)
//       ) {
//         // Should have restriction effect
//         expect(stoneByDay.effects).toHaveLength(1);
//         const effect = stoneByDay.effects[0] as any;
//         expect(effect.type).toBe("restriction");
//         expect(effect.restriction).toBe("ready");
//       }
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [brooklynSecondInCommand],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(brooklynSecondInCommand);
//
//       expect(cardUnderTest.strength).toBe(3);
//       expect(cardUnderTest.willpower).toBe(2);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(2);
//     });
//
//     it("should be inkwell card", () => {
//       expect(brooklynSecondInCommand.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(brooklynSecondInCommand.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "gargoyle",
//       ]);
//     });
//
//     it("should be ruby color", () => {
//       expect(brooklynSecondInCommand.colors).toEqual(["ruby"]);
//     });
//   });
//
//   describe("Gameplay", () => {
//     it("should be playable from hand", async () => {
//       const testEngine = new TestEngine({
//         inkwell: brooklynSecondInCommand.cost,
//         hand: [brooklynSecondInCommand],
//       });
//
//       await testEngine.playCard(brooklynSecondInCommand);
//
//       const cardUnderTest = testEngine.getCardModel(brooklynSecondInCommand);
//       expect(cardUnderTest.zone).toBe("play");
//     });
//   });
// });
//
