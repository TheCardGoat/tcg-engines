// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   boltSuperdog,
//   ladyElegantSpaniel,
//   mufasaRespectedKing,
//   trampEnterprisingDog,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Tramp - Enterprising Dog", () => {
//   it("HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: trampEnterprisingDog.cost - 1,
//       play: [ladyElegantSpaniel],
//       hand: [trampEnterprisingDog],
//     });
//
//     await testEngine.playCard(trampEnterprisingDog);
//
//     expect(testEngine.getCardModel(trampEnterprisingDog).zone).toBe("play");
//   });
//
//   it("NO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: trampEnterprisingDog.cost + boltSuperdog.cost,
//       hand: [trampEnterprisingDog, boltSuperdog],
//       play: [ladyElegantSpaniel, mufasaRespectedKing],
//     });
//
//     await testEngine.playCard(trampEnterprisingDog, {
//       targets: [ladyElegantSpaniel],
//     });
//
//     expect(testEngine.getCardModel(ladyElegantSpaniel).strength).toBe(
//       ladyElegantSpaniel.strength + 2,
//     );
//
//     await testEngine.playCard(boltSuperdog);
//
//     expect(testEngine.getCardModel(ladyElegantSpaniel).strength).toBe(
//       ladyElegantSpaniel.strength + 2,
//     );
//   });
//
//   it("NO TIME FOR WISECRACKS - Playing two Tramps gives each buff based on character count at time of play", async () => {
//     const testEngine = new TestEngine({
//       inkwell: trampEnterprisingDog.cost * 2,
//       hand: [trampEnterprisingDog, trampEnterprisingDog],
//       play: [ladyElegantSpaniel, mufasaRespectedKing],
//     });
//
//     const firstTramp = testEngine.getCardModel(trampEnterprisingDog, 0);
//     const secondTramp = testEngine.getCardModel(trampEnterprisingDog, 1);
//
//     // First Tramp: 2 other characters in play (Lady + Mufasa)
//     await testEngine.playCard(firstTramp, {
//       targets: [ladyElegantSpaniel],
//     });
//
//     expect(testEngine.getCardModel(ladyElegantSpaniel).strength).toBe(
//       ladyElegantSpaniel.strength + 2,
//     );
//
//     // Second Tramp: 3 other characters in play (Lady + Mufasa + first Tramp)
//     await testEngine.playCard(secondTramp, {
//       targets: [ladyElegantSpaniel],
//     });
//
//     // Lady has +2 from first Tramp and +3 from second Tramp = +5 total
//     expect(testEngine.getCardModel(ladyElegantSpaniel).strength).toBe(
//       ladyElegantSpaniel.strength + 5,
//     );
//   });
// });
//
