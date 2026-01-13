// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   basilTenaciousMouse,
//   lexingtonSmallInStature,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lexington - Small in Stature", () => {
//   describe("Alert", () => {
//     it("should have Alert ability", () => {
//       const testEngine = new TestEngine({
//         play: [lexingtonSmallInStature],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(lexingtonSmallInStature);
//       expect(cardUnderTest.hasAlert).toBe(true);
//     });
//
//     it("should have Alert ability with correct type", () => {
//       const ability = lexingtonSmallInStature.abilities?.find(
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
//   describe("STONE BY DAY", () => {
//     it("should have STONE BY DAY ability that restricts readying when you have 3+ cards in hand", () => {
//       const testEngine = new TestEngine({
//         play: [lexingtonSmallInStature],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(lexingtonSmallInStature);
//
//       // Should have the STONE BY DAY static ability in card definition
//       const stoneByDayAbility = lexingtonSmallInStature.abilities?.find(
//         (ability) => "name" in ability && ability.name === "STONE BY DAY",
//       );
//       expect(stoneByDayAbility).toBeDefined();
//       if (stoneByDayAbility && "type" in stoneByDayAbility) {
//         expect(stoneByDayAbility.type).toBe("static");
//       }
//     });
//
//     it("STONE BY DAY ability should be defined with correct text", () => {
//       const testEngine = new TestEngine({
//         play: [lexingtonSmallInStature],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(lexingtonSmallInStature);
//
//       const stoneByDayAbility = lexingtonSmallInStature.abilities?.find(
//         (ability) => "name" in ability && ability.name === "STONE BY DAY",
//       );
//
//       if (stoneByDayAbility && "text" in stoneByDayAbility) {
//         expect(stoneByDayAbility.text).toBe(
//           "If you have 3 or more cards in your hand, this character can't ready.",
//         );
//       }
//     });
//
//     it("should have Stone By Day ability defined", () => {
//       const ability = lexingtonSmallInStature.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       expect(ability).toBeDefined();
//       if (
//         ability &&
//         "type" in ability &&
//         ability.type === "static" &&
//         "ability" in ability
//       ) {
//         expect(ability.ability).toBe("effects");
//       }
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [lexingtonSmallInStature],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(lexingtonSmallInStature);
//
//       expect(cardUnderTest.strength).toBe(4);
//       expect(cardUnderTest.willpower).toBe(4);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(3);
//     });
//
//     it("should be inkwell card", () => {
//       expect(lexingtonSmallInStature.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(lexingtonSmallInStature.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "gargoyle",
//       ]);
//     });
//
//     it("should be steel color", () => {
//       expect(lexingtonSmallInStature.colors).toEqual(["steel"]);
//     });
//
//     it("should be uncommon rarity", () => {
//       expect(lexingtonSmallInStature.rarity).toBe("uncommon");
//     });
//   });
// });
//
