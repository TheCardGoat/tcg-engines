// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   DuchessElegantFeline,
//   MufasaRespectedKing,
//   OutOfOrder,
//   WreckitRalphHerosDuty,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wreck-it Ralph - Hero's Duty", () => {
//   It("OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: outOfOrder.cost + dragonFire.cost,
//       Play: [wreckitRalphHerosDuty, duchessElegantFeline, mufasaRespectedKing],
//       Hand: [dragonFire, outOfOrder],
//     });
//
//     Expect(testEngine.getCardModel(wreckitRalphHerosDuty).lore).toBe(
//       WreckitRalphHerosDuty.lore,
//     );
//     Await testEngine.playCard(dragonFire, {
//       Targets: [duchessElegantFeline],
//     });
//     Expect(testEngine.getCardModel(wreckitRalphHerosDuty).lore).toBe(
//       WreckitRalphHerosDuty.lore + 1,
//     );
//     Await testEngine.playCard(outOfOrder, {
//       Targets: [mufasaRespectedKing],
//     });
//     Expect(testEngine.getCardModel(wreckitRalphHerosDuty).lore).toBe(
//       WreckitRalphHerosDuty.lore + 2,
//     );
//   });
// });
//
