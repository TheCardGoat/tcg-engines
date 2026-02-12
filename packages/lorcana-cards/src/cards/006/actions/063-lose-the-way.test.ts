// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   IWontGiveIn,
//   LoseTheWay,
// } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lose The Way", () => {
//   It("Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: loseTheWay.cost,
//         Hand: [loseTheWay, iWontGiveIn],
//       },
//       {
//         Play: [mickeyBraveLittleTailor],
//       },
//     );
//
//     Await testEngine.playCard(
//       LoseTheWay,
//       {
//         Targets: [mickeyBraveLittleTailor],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(false);
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [iWontGiveIn] });
//     Expect(testEngine.getCardModel(iWontGiveIn).zone).toBe("discard");
//
//     Await testEngine.passTurn();
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(false);
//   });
//
//   It("Reproduction: Targeting an already exerted character should still trigger the secondary effect", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: loseTheWay.cost,
//         Hand: [loseTheWay, iWontGiveIn],
//       },
//       {
//         Play: [mickeyBraveLittleTailor],
//       },
//     );
//
//     // Setup: Exert the target character
//     Const mickey = testEngine.getCardModel(mickeyBraveLittleTailor);
//     Mickey.updateCardMeta({ exerted: true });
//
//     Await testEngine.playCard(
//       LoseTheWay,
//       {
//         Targets: [mickeyBraveLittleTailor],
//       },
//       True,
//     );
//
//     // Expectation: Should be prompted to discard a card
//     // If the bug exists, this might fail or the stack might be empty
//     Expect(testEngine.stackLayers.length).toBeGreaterThan(0);
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [iWontGiveIn] });
//     Expect(testEngine.getCardModel(iWontGiveIn).zone).toBe("discard");
//
//     Await testEngine.passTurn();
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(false);
//   });
// });
//
