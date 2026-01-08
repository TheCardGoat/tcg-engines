// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import {
//   duchessElegantFeline,
//   mufasaRespectedKing,
//   outOfOrder,
//   wreckitRalphHerosDuty,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Wreck-it Ralph - Hero's Duty", () => {
//   it("OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: outOfOrder.cost + dragonFire.cost,
//       play: [wreckitRalphHerosDuty, duchessElegantFeline, mufasaRespectedKing],
//       hand: [dragonFire, outOfOrder],
//     });
//
//     expect(testEngine.getCardModel(wreckitRalphHerosDuty).lore).toBe(
//       wreckitRalphHerosDuty.lore,
//     );
//     await testEngine.playCard(dragonFire, {
//       targets: [duchessElegantFeline],
//     });
//     expect(testEngine.getCardModel(wreckitRalphHerosDuty).lore).toBe(
//       wreckitRalphHerosDuty.lore + 1,
//     );
//     await testEngine.playCard(outOfOrder, {
//       targets: [mufasaRespectedKing],
//     });
//     expect(testEngine.getCardModel(wreckitRalphHerosDuty).lore).toBe(
//       wreckitRalphHerosDuty.lore + 2,
//     );
//   });
// });
//
