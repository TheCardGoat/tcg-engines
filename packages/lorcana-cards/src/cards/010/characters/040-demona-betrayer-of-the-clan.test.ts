// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { demonaBetrayerOfTheClan } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Demona - Betrayer of the Clan", () => {
//   Describe("Challenger +2", () => {
//     It("should have Challenger +2 ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [demonaBetrayerOfTheClan],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//       Expect(cardUnderTest.hasChallenger).toBe(true);
//     });
//
//     It("should have challenger value of 2", () => {
//       Const testEngine = new TestEngine({
//         Play: [demonaBetrayerOfTheClan],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       // Check the card definition directly
//       Const challengerAbility = demonaBetrayerOfTheClan.abilities?.find(
//         (ability) =>
//           "type" in ability &&
//           Ability.type === "static" &&
//           "ability" in ability &&
//           Ability.ability === "challenger",
//       );
//
//       Expect(challengerAbility).toBeDefined();
//       If (challengerAbility && "value" in challengerAbility) {
//         Expect(challengerAbility.value).toBe(2);
//       }
//     });
//   });
//
//   Describe("STONE BY DAY", () => {
//     It("should have STONE BY DAY ability that restricts readying when you have 3+ cards in hand", () => {
//       Const testEngine = new TestEngine({
//         Play: [demonaBetrayerOfTheClan],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       // Should have the STONE BY DAY static ability in card definition
//       Const stoneByDayAbility = demonaBetrayerOfTheClan.abilities?.find(
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
//         Play: [demonaBetrayerOfTheClan],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       Const stoneByDayAbility = demonaBetrayerOfTheClan.abilities?.find(
//         (ability) => "name" in ability && ability.name === "STONE BY DAY",
//       );
//
//       If (stoneByDayAbility && "text" in stoneByDayAbility) {
//         Expect(stoneByDayAbility.text).toBe(
//           "If you have 3 or more cards in your hand, this character can't ready.",
//         );
//       }
//     });
//   });
//
//   Describe("Combined abilities", () => {
//     It("should have both Challenger and STONE BY DAY abilities", () => {
//       Const testEngine = new TestEngine({
//         Play: [demonaBetrayerOfTheClan],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       // Should have Challenger
//       Expect(cardUnderTest.hasChallenger).toBe(true);
//
//       // Should have the STONE BY DAY static ability
//       Const stoneByDayAbility = demonaBetrayerOfTheClan.abilities?.find(
//         (ability) => "name" in ability && ability.name === "STONE BY DAY",
//       );
//       Expect(stoneByDayAbility).toBeDefined();
//     });
//
//     It("should have correct base stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [demonaBetrayerOfTheClan],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       Expect(cardUnderTest.strength).toBe(4);
//       Expect(cardUnderTest.willpower).toBe(6);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(4);
//     });
//   });
// });
//
