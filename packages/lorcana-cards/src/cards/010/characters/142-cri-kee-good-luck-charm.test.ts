// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { crikeeGoodLuckCharm } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cri-Kee - Good Luck Charm", () => {
//   Describe("Alert", () => {
//     It("should have Alert ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [crikeeGoodLuckCharm],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(crikeeGoodLuckCharm);
//       Expect(cardUnderTest.hasAlert).toBe(true);
//     });
//
//     It("should have Alert ability with correct type", () => {
//       Const ability = crikeeGoodLuckCharm.abilities?.find(
//         (a) =>
//           "type" in a &&
//           A.type === "static" &&
//           "ability" in a &&
//           A.ability === "alert",
//       );
//
//       Expect(ability).toBeDefined();
//       If (ability && "ability" in ability) {
//         Expect(ability.ability).toBe("alert");
//       }
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [crikeeGoodLuckCharm],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(crikeeGoodLuckCharm);
//
//       Expect(cardUnderTest.strength).toBe(3);
//       Expect(cardUnderTest.willpower).toBe(2);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(2);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(crikeeGoodLuckCharm.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(crikeeGoodLuckCharm.characteristics).toEqual([
//         "storyborn",
//         "ally",
//       ]);
//     });
//
//     It("should be sapphire color", () => {
//       Expect(crikeeGoodLuckCharm.colors).toEqual(["sapphire"]);
//     });
//
//     It("should be common rarity", () => {
//       Expect(crikeeGoodLuckCharm.rarity).toBe("common");
//     });
//   });
// });
//
