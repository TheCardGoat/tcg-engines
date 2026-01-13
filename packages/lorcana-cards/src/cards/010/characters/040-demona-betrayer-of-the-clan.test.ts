// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { demonaBetrayerOfTheClan } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Demona - Betrayer of the Clan", () => {
//   describe("Challenger +2", () => {
//     it("should have Challenger +2 ability", () => {
//       const testEngine = new TestEngine({
//         play: [demonaBetrayerOfTheClan],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//       expect(cardUnderTest.hasChallenger).toBe(true);
//     });
//
//     it("should have challenger value of 2", () => {
//       const testEngine = new TestEngine({
//         play: [demonaBetrayerOfTheClan],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       // Check the card definition directly
//       const challengerAbility = demonaBetrayerOfTheClan.abilities?.find(
//         (ability) =>
//           "type" in ability &&
//           ability.type === "static" &&
//           "ability" in ability &&
//           ability.ability === "challenger",
//       );
//
//       expect(challengerAbility).toBeDefined();
//       if (challengerAbility && "value" in challengerAbility) {
//         expect(challengerAbility.value).toBe(2);
//       }
//     });
//   });
//
//   describe("STONE BY DAY", () => {
//     it("should have STONE BY DAY ability that restricts readying when you have 3+ cards in hand", () => {
//       const testEngine = new TestEngine({
//         play: [demonaBetrayerOfTheClan],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       // Should have the STONE BY DAY static ability in card definition
//       const stoneByDayAbility = demonaBetrayerOfTheClan.abilities?.find(
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
//         play: [demonaBetrayerOfTheClan],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       const stoneByDayAbility = demonaBetrayerOfTheClan.abilities?.find(
//         (ability) => "name" in ability && ability.name === "STONE BY DAY",
//       );
//
//       if (stoneByDayAbility && "text" in stoneByDayAbility) {
//         expect(stoneByDayAbility.text).toBe(
//           "If you have 3 or more cards in your hand, this character can't ready.",
//         );
//       }
//     });
//   });
//
//   describe("Combined abilities", () => {
//     it("should have both Challenger and STONE BY DAY abilities", () => {
//       const testEngine = new TestEngine({
//         play: [demonaBetrayerOfTheClan],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       // Should have Challenger
//       expect(cardUnderTest.hasChallenger).toBe(true);
//
//       // Should have the STONE BY DAY static ability
//       const stoneByDayAbility = demonaBetrayerOfTheClan.abilities?.find(
//         (ability) => "name" in ability && ability.name === "STONE BY DAY",
//       );
//       expect(stoneByDayAbility).toBeDefined();
//     });
//
//     it("should have correct base stats", () => {
//       const testEngine = new TestEngine({
//         play: [demonaBetrayerOfTheClan],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(demonaBetrayerOfTheClan);
//
//       expect(cardUnderTest.strength).toBe(4);
//       expect(cardUnderTest.willpower).toBe(6);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(4);
//     });
//   });
// });
//
