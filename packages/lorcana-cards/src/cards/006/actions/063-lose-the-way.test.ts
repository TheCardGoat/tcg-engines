// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   iWontGiveIn,
//   loseTheWay,
// } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lose The Way", () => {
//   it("Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: loseTheWay.cost,
//         hand: [loseTheWay, iWontGiveIn],
//       },
//       {
//         play: [mickeyBraveLittleTailor],
//       },
//     );
//
//     await testEngine.playCard(
//       loseTheWay,
//       {
//         targets: [mickeyBraveLittleTailor],
//       },
//       true,
//     );
//
//     expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(false);
//
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [iWontGiveIn] });
//     expect(testEngine.getCardModel(iWontGiveIn).zone).toBe("discard");
//
//     await testEngine.passTurn();
//     expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(false);
//   });
//
//   it("Reproduction: Targeting an already exerted character should still trigger the secondary effect", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: loseTheWay.cost,
//         hand: [loseTheWay, iWontGiveIn],
//       },
//       {
//         play: [mickeyBraveLittleTailor],
//       },
//     );
//
//     // Setup: Exert the target character
//     const mickey = testEngine.getCardModel(mickeyBraveLittleTailor);
//     mickey.updateCardMeta({ exerted: true });
//
//     await testEngine.playCard(
//       loseTheWay,
//       {
//         targets: [mickeyBraveLittleTailor],
//       },
//       true,
//     );
//
//     // Expectation: Should be prompted to discard a card
//     // If the bug exists, this might fail or the stack might be empty
//     expect(testEngine.stackLayers.length).toBeGreaterThan(0);
//
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [iWontGiveIn] });
//     expect(testEngine.getCardModel(iWontGiveIn).zone).toBe("discard");
//
//     await testEngine.passTurn();
//     expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(false);
//   });
// });
//
