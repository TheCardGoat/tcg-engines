// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BoltSuperdog,
//   LadyElegantSpaniel,
//   MufasaRespectedKing,
//   TrampEnterprisingDog,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tramp - Enterprising Dog", () => {
//   It("HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: trampEnterprisingDog.cost - 1,
//       Play: [ladyElegantSpaniel],
//       Hand: [trampEnterprisingDog],
//     });
//
//     Await testEngine.playCard(trampEnterprisingDog);
//
//     Expect(testEngine.getCardModel(trampEnterprisingDog).zone).toBe("play");
//   });
//
//   It("NO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: trampEnterprisingDog.cost + boltSuperdog.cost,
//       Hand: [trampEnterprisingDog, boltSuperdog],
//       Play: [ladyElegantSpaniel, mufasaRespectedKing],
//     });
//
//     Await testEngine.playCard(trampEnterprisingDog, {
//       Targets: [ladyElegantSpaniel],
//     });
//
//     Expect(testEngine.getCardModel(ladyElegantSpaniel).strength).toBe(
//       LadyElegantSpaniel.strength + 2,
//     );
//
//     Await testEngine.playCard(boltSuperdog);
//
//     Expect(testEngine.getCardModel(ladyElegantSpaniel).strength).toBe(
//       LadyElegantSpaniel.strength + 2,
//     );
//   });
//
//   It("NO TIME FOR WISECRACKS - Playing two Tramps gives each buff based on character count at time of play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: trampEnterprisingDog.cost * 2,
//       Hand: [trampEnterprisingDog, trampEnterprisingDog],
//       Play: [ladyElegantSpaniel, mufasaRespectedKing],
//     });
//
//     Const firstTramp = testEngine.getCardModel(trampEnterprisingDog, 0);
//     Const secondTramp = testEngine.getCardModel(trampEnterprisingDog, 1);
//
//     // First Tramp: 2 other characters in play (Lady + Mufasa)
//     Await testEngine.playCard(firstTramp, {
//       Targets: [ladyElegantSpaniel],
//     });
//
//     Expect(testEngine.getCardModel(ladyElegantSpaniel).strength).toBe(
//       LadyElegantSpaniel.strength + 2,
//     );
//
//     // Second Tramp: 3 other characters in play (Lady + Mufasa + first Tramp)
//     Await testEngine.playCard(secondTramp, {
//       Targets: [ladyElegantSpaniel],
//     });
//
//     // Lady has +2 from first Tramp and +3 from second Tramp = +5 total
//     Expect(testEngine.getCardModel(ladyElegantSpaniel).strength).toBe(
//       LadyElegantSpaniel.strength + 5,
//     );
//   });
// });
//
