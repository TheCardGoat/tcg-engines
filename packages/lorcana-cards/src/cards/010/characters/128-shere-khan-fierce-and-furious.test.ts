// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { shereKhanFierceAndFurious } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Shere Khan - Fierce and Furious", () => {
//   It("should have Shift 5", () => {
//     Const testEngine = new TestEngine({
//       Play: [shereKhanFierceAndFurious],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(shereKhanFierceAndFurious);
//     Expect(cardUnderTest.hasShift).toBe(true);
//     Expect(cardUnderTest.shiftInkCost).toBe(5);
//   });
//
//   Describe("WILD RAGE - 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.", () => {
//     It("should ready an exerted Shere Khan and prevent him from questing", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 1,
//         Play: [shereKhanFierceAndFurious],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(shereKhanFierceAndFurious);
//
//       // Exert Shere Khan
//       CardUnderTest.exert();
//       Expect(cardUnderTest.ready).toBe(false);
//
//       // Activate WILD RAGE ability
//       Const ability = cardUnderTest
//         .nativeAbilities()
//         .find((ab) => ab.name === "WILD RAGE");
//       Expect(ability).toBeDefined();
//
//       Await testEngine.activateCard(cardUnderTest, { ability: "WILD RAGE" });
//
//       // Should be ready but can't quest
//       Expect(cardUnderTest.ready).toBe(true);
//       Expect(cardUnderTest.canQuest).toBe(false);
//       // Should have 1 damage
//       Expect(cardUnderTest.damage).toBe(1);
//     });
//
//     It("should deal 1 damage to activate", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 2,
//         Play: [shereKhanFierceAndFurious],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(shereKhanFierceAndFurious);
//       CardUnderTest.exert();
//
//       Expect(cardUnderTest.damage).toBe(0);
//
//       // Activate WILD RAGE
//       Await testEngine.activateCard(cardUnderTest, { ability: "WILD RAGE" });
//
//       // Should have 1 damage (costs 1 ink + 1 damage to self)
//       Expect(cardUnderTest.damage).toBe(1);
//       Expect(cardUnderTest.ready).toBe(true);
//     });
//
//     It("should allow questing on the next turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 1,
//         Play: [shereKhanFierceAndFurious],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(shereKhanFierceAndFurious);
//       CardUnderTest.exert();
//
//       // Activate WILD RAGE
//       Await testEngine.activateCard(cardUnderTest, { ability: "WILD RAGE" });
//
//       Expect(cardUnderTest.canQuest).toBe(false);
//
//       // Pass turn
//       TestEngine.passTurn();
//       TestEngine.passTurn();
//
//       // Should be able to quest next turn
//       Expect(cardUnderTest.canQuest).toBe(true);
//     });
//   });
// });
//
