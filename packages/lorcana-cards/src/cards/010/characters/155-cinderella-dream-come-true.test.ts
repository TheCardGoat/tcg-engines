// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/157-tipo-growing-son";
// Import {
//   CinderellaDreamComeTrue,
//   EilonwyPrincessOfLlyr,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cinderella - Dream Come True", () => {
//   It("WHATEVER YOU WISH FOR At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: eilonwyPrincessOfLlyr.cost,
//       Play: [cinderellaDreamComeTrue],
//       Hand: [tipoGrowingSon, eilonwyPrincessOfLlyr],
//       Deck: 10,
//     });
//
//     Await testEngine.playCard(eilonwyPrincessOfLlyr);
//     Await testEngine.passTurn();
//
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.acceptOptionalLayer();
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     Await testEngine.resolveTopOfStack({ targets: [tipoGrowingSon] });
//
//     Expect(testEngine.getCardModel(tipoGrowingSon).zone).toBe("inkwell");
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     Expect(testEngine.getZonesCardCount("player_one").deck).toBe(9);
//   });
//
//   It("Skipping layer", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: eilonwyPrincessOfLlyr.cost,
//       Play: [cinderellaDreamComeTrue],
//       Hand: [tipoGrowingSon, eilonwyPrincessOfLlyr],
//       Deck: 10,
//     });
//
//     Await testEngine.playCard(eilonwyPrincessOfLlyr);
//     Await testEngine.passTurn();
//
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.skipTopOfStack();
//
//     Expect(testEngine.getCardModel(tipoGrowingSon).zone).toBe("hand");
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     Expect(testEngine.getZonesCardCount("player_one").deck).toBe(10);
//   });
//
//   It("Playing Cinderella herself should trigger her own effect (she is a Princess)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: cinderellaDreamComeTrue.cost,
//       Hand: [cinderellaDreamComeTrue, tipoGrowingSon],
//       Deck: 10,
//     });
//
//     Await testEngine.playCard(cinderellaDreamComeTrue);
//     Await testEngine.passTurn();
//
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.acceptOptionalLayer();
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     Await testEngine.resolveTopOfStack({ targets: [tipoGrowingSon] });
//
//     Expect(testEngine.getCardModel(tipoGrowingSon).zone).toBe("inkwell");
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     Expect(testEngine.getZonesCardCount("player_one").deck).toBe(9);
//   });
// });
//
