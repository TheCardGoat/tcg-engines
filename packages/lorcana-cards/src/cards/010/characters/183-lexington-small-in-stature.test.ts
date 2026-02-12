// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BasilTenaciousMouse,
//   LexingtonSmallInStature,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lexington - Small in Stature", () => {
//   Describe("Alert", () => {
//     It("should have Alert ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [lexingtonSmallInStature],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(lexingtonSmallInStature);
//       Expect(cardUnderTest.hasAlert).toBe(true);
//     });
//
//     It("should have Alert ability with correct type", () => {
//       Const ability = lexingtonSmallInStature.abilities?.find(
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
//   Describe("STONE BY DAY", () => {
//     It("should have STONE BY DAY ability that restricts readying when you have 3+ cards in hand", () => {
//       Const testEngine = new TestEngine({
//         Play: [lexingtonSmallInStature],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(lexingtonSmallInStature);
//
//       // Should have the STONE BY DAY static ability in card definition
//       Const stoneByDayAbility = lexingtonSmallInStature.abilities?.find(
//         (ability) => "name" in ability && ability.name === "STONE BY DAY",
//       );
//       Expect(stoneByDayAbility).toBeDefined();
//       If (stoneByDayAbility && "type" in stoneByDayAbility) {
//         Expect(stoneByDayAbility.type).toBe("static");
//       }
//     });
//
//     It("STONE BY DAY ability should be defined with correct text", () => {
//       Const testEngine = new TestEngine({
//         Play: [lexingtonSmallInStature],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(lexingtonSmallInStature);
//
//       Const stoneByDayAbility = lexingtonSmallInStature.abilities?.find(
//         (ability) => "name" in ability && ability.name === "STONE BY DAY",
//       );
//
//       If (stoneByDayAbility && "text" in stoneByDayAbility) {
//         Expect(stoneByDayAbility.text).toBe(
//           "If you have 3 or more cards in your hand, this character can't ready.",
//         );
//       }
//     });
//
//     It("should have Stone By Day ability defined", () => {
//       Const ability = lexingtonSmallInStature.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       Expect(ability).toBeDefined();
//       If (
//         Ability &&
//         "type" in ability &&
//         Ability.type === "static" &&
//         "ability" in ability
//       ) {
//         Expect(ability.ability).toBe("effects");
//       }
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [lexingtonSmallInStature],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(lexingtonSmallInStature);
//
//       Expect(cardUnderTest.strength).toBe(4);
//       Expect(cardUnderTest.willpower).toBe(4);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(3);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(lexingtonSmallInStature.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(lexingtonSmallInStature.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "gargoyle",
//       ]);
//     });
//
//     It("should be steel color", () => {
//       Expect(lexingtonSmallInStature.colors).toEqual(["steel"]);
//     });
//
//     It("should be uncommon rarity", () => {
//       Expect(lexingtonSmallInStature.rarity).toBe("uncommon");
//     });
//   });
// });
//
