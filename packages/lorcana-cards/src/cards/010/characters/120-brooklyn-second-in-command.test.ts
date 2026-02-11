// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { brooklynSecondInCommand } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Brooklyn - Second in Command", () => {
//   Describe("Evasive", () => {
//     It("should have Evasive ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [brooklynSecondInCommand],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(brooklynSecondInCommand);
//       Expect(cardUnderTest.hasEvasive).toBe(true);
//     });
//   });
//
//   Describe("STONE BY DAY - If you have 3 or more cards in your hand, this character can't ready", () => {
//     It("should have the STONE BY DAY ability defined", () => {
//       Const stoneByDay = brooklynSecondInCommand.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       Expect(stoneByDay).toBeDefined();
//
//       If (
//         StoneByDay &&
//         "conditions" in stoneByDay &&
//         Array.isArray(stoneByDay.conditions)
//       ) {
//         // Should have condition checking hand count >= 3
//         Expect(stoneByDay.conditions).toHaveLength(1);
//         Const condition = stoneByDay.conditions[0] as any;
//         Expect(condition.type).toBe("filter");
//         Expect(condition.comparison.operator).toBe("gte");
//         Expect(condition.comparison.value).toBe(3);
//       }
//
//       If (
//         StoneByDay &&
//         "effects" in stoneByDay &&
//         Array.isArray(stoneByDay.effects)
//       ) {
//         // Should have restriction effect
//         Expect(stoneByDay.effects).toHaveLength(1);
//         Const effect = stoneByDay.effects[0] as any;
//         Expect(effect.type).toBe("restriction");
//         Expect(effect.restriction).toBe("ready");
//       }
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [brooklynSecondInCommand],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(brooklynSecondInCommand);
//
//       Expect(cardUnderTest.strength).toBe(3);
//       Expect(cardUnderTest.willpower).toBe(2);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(2);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(brooklynSecondInCommand.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(brooklynSecondInCommand.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "gargoyle",
//       ]);
//     });
//
//     It("should be ruby color", () => {
//       Expect(brooklynSecondInCommand.colors).toEqual(["ruby"]);
//     });
//   });
//
//   Describe("Gameplay", () => {
//     It("should be playable from hand", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: brooklynSecondInCommand.cost,
//         Hand: [brooklynSecondInCommand],
//       });
//
//       Await testEngine.playCard(brooklynSecondInCommand);
//
//       Const cardUnderTest = testEngine.getCardModel(brooklynSecondInCommand);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//   });
// });
//
