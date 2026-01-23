// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { crikeeGoodLuckCharm } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Cri-Kee - Good Luck Charm", () => {
//   describe("Alert", () => {
//     it("should have Alert ability", () => {
//       const testEngine = new TestEngine({
//         play: [crikeeGoodLuckCharm],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(crikeeGoodLuckCharm);
//       expect(cardUnderTest.hasAlert).toBe(true);
//     });
//
//     it("should have Alert ability with correct type", () => {
//       const ability = crikeeGoodLuckCharm.abilities?.find(
//         (a) =>
//           "type" in a &&
//           a.type === "static" &&
//           "ability" in a &&
//           a.ability === "alert",
//       );
//
//       expect(ability).toBeDefined();
//       if (ability && "ability" in ability) {
//         expect(ability.ability).toBe("alert");
//       }
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [crikeeGoodLuckCharm],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(crikeeGoodLuckCharm);
//
//       expect(cardUnderTest.strength).toBe(3);
//       expect(cardUnderTest.willpower).toBe(2);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(2);
//     });
//
//     it("should be inkwell card", () => {
//       expect(crikeeGoodLuckCharm.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(crikeeGoodLuckCharm.characteristics).toEqual([
//         "storyborn",
//         "ally",
//       ]);
//     });
//
//     it("should be sapphire color", () => {
//       expect(crikeeGoodLuckCharm.colors).toEqual(["sapphire"]);
//     });
//
//     it("should be common rarity", () => {
//       expect(crikeeGoodLuckCharm.rarity).toBe("common");
//     });
//   });
// });
//
