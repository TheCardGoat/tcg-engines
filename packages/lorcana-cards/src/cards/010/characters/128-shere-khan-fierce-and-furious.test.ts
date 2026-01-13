// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { shereKhanFierceAndFurious } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Shere Khan - Fierce and Furious", () => {
//   it("should have Shift 5", () => {
//     const testEngine = new TestEngine({
//       play: [shereKhanFierceAndFurious],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(shereKhanFierceAndFurious);
//     expect(cardUnderTest.hasShift).toBe(true);
//     expect(cardUnderTest.shiftInkCost).toBe(5);
//   });
//
//   describe("WILD RAGE - 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.", () => {
//     it("should ready an exerted Shere Khan and prevent him from questing", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 1,
//         play: [shereKhanFierceAndFurious],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(shereKhanFierceAndFurious);
//
//       // Exert Shere Khan
//       cardUnderTest.exert();
//       expect(cardUnderTest.ready).toBe(false);
//
//       // Activate WILD RAGE ability
//       const ability = cardUnderTest
//         .nativeAbilities()
//         .find((ab) => ab.name === "WILD RAGE");
//       expect(ability).toBeDefined();
//
//       await testEngine.activateCard(cardUnderTest, { ability: "WILD RAGE" });
//
//       // Should be ready but can't quest
//       expect(cardUnderTest.ready).toBe(true);
//       expect(cardUnderTest.canQuest).toBe(false);
//       // Should have 1 damage
//       expect(cardUnderTest.damage).toBe(1);
//     });
//
//     it("should deal 1 damage to activate", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 2,
//         play: [shereKhanFierceAndFurious],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(shereKhanFierceAndFurious);
//       cardUnderTest.exert();
//
//       expect(cardUnderTest.damage).toBe(0);
//
//       // Activate WILD RAGE
//       await testEngine.activateCard(cardUnderTest, { ability: "WILD RAGE" });
//
//       // Should have 1 damage (costs 1 ink + 1 damage to self)
//       expect(cardUnderTest.damage).toBe(1);
//       expect(cardUnderTest.ready).toBe(true);
//     });
//
//     it("should allow questing on the next turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 1,
//         play: [shereKhanFierceAndFurious],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(shereKhanFierceAndFurious);
//       cardUnderTest.exert();
//
//       // Activate WILD RAGE
//       await testEngine.activateCard(cardUnderTest, { ability: "WILD RAGE" });
//
//       expect(cardUnderTest.canQuest).toBe(false);
//
//       // Pass turn
//       testEngine.passTurn();
//       testEngine.passTurn();
//
//       // Should be able to quest next turn
//       expect(cardUnderTest.canQuest).toBe(true);
//     });
//   });
// });
//
