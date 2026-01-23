// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/157-tipo-growing-son";
// import {
//   cinderellaDreamComeTrue,
//   eilonwyPrincessOfLlyr,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Cinderella - Dream Come True", () => {
//   it("WHATEVER YOU WISH FOR At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: eilonwyPrincessOfLlyr.cost,
//       play: [cinderellaDreamComeTrue],
//       hand: [tipoGrowingSon, eilonwyPrincessOfLlyr],
//       deck: 10,
//     });
//
//     await testEngine.playCard(eilonwyPrincessOfLlyr);
//     await testEngine.passTurn();
//
//     testEngine.changeActivePlayer("player_one");
//     await testEngine.acceptOptionalLayer();
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     await testEngine.resolveTopOfStack({ targets: [tipoGrowingSon] });
//
//     expect(testEngine.getCardModel(tipoGrowingSon).zone).toBe("inkwell");
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     expect(testEngine.getZonesCardCount("player_one").deck).toBe(9);
//   });
//
//   it("Skipping layer", async () => {
//     const testEngine = new TestEngine({
//       inkwell: eilonwyPrincessOfLlyr.cost,
//       play: [cinderellaDreamComeTrue],
//       hand: [tipoGrowingSon, eilonwyPrincessOfLlyr],
//       deck: 10,
//     });
//
//     await testEngine.playCard(eilonwyPrincessOfLlyr);
//     await testEngine.passTurn();
//
//     testEngine.changeActivePlayer("player_one");
//     await testEngine.skipTopOfStack();
//
//     expect(testEngine.getCardModel(tipoGrowingSon).zone).toBe("hand");
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     expect(testEngine.getZonesCardCount("player_one").deck).toBe(10);
//   });
//
//   it("Playing Cinderella herself should trigger her own effect (she is a Princess)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: cinderellaDreamComeTrue.cost,
//       hand: [cinderellaDreamComeTrue, tipoGrowingSon],
//       deck: 10,
//     });
//
//     await testEngine.playCard(cinderellaDreamComeTrue);
//     await testEngine.passTurn();
//
//     testEngine.changeActivePlayer("player_one");
//     await testEngine.acceptOptionalLayer();
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     await testEngine.resolveTopOfStack({ targets: [tipoGrowingSon] });
//
//     expect(testEngine.getCardModel(tipoGrowingSon).zone).toBe("inkwell");
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     expect(testEngine.getZonesCardCount("player_one").deck).toBe(9);
//   });
// });
//
