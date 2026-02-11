// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { iagoFurious } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Iago - Furious", () => {
//   It("should have Challenger +5 ability", () => {
//     Const testEngine = new TestEngine({
//       Play: [iagoFurious],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(iagoFurious);
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
//
//   It("should have challenger value of 5", () => {
//     Const testEngine = new TestEngine({
//       Play: [iagoFurious],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(iagoFurious);
//
//     // Check the card definition directly
//     Const challengerAbility = iagoFurious.abilities?.find(
//       (ability: any) =>
//         Ability.type === "static" &&
//         "ability" in ability &&
//         Ability.ability === "challenger",
//     );
//
//     Expect(challengerAbility).toBeDefined();
//     If (challengerAbility && "value" in challengerAbility) {
//       Expect(challengerAbility.value).toBe(5);
//     }
//   });
// });
//
