// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { iagoFurious } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Iago - Furious", () => {
//   it("should have Challenger +5 ability", () => {
//     const testEngine = new TestEngine({
//       play: [iagoFurious],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(iagoFurious);
//     expect(cardUnderTest.hasChallenger).toBe(true);
//   });
//
//   it("should have challenger value of 5", () => {
//     const testEngine = new TestEngine({
//       play: [iagoFurious],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(iagoFurious);
//
//     // Check the card definition directly
//     const challengerAbility = iagoFurious.abilities?.find(
//       (ability: any) =>
//         ability.type === "static" &&
//         "ability" in ability &&
//         ability.ability === "challenger",
//     );
//
//     expect(challengerAbility).toBeDefined();
//     if (challengerAbility && "value" in challengerAbility) {
//       expect(challengerAbility.value).toBe(5);
//     }
//   });
// });
//
