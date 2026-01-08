// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   letTheStormRageOn,
//   strengthOfARagingFire,
// } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { shereKhanInfamousTiger } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("IT IS REGRETTABLE When you play this character, discard your hand.", () => {
//   it.skip("", async () => {
//     const testEngine = new TestEngine({
//       inkwell: shereKhanInfamousTiger.cost,
//       hand: [shereKhanInfamousTiger, letTheStormRageOn, strengthOfARagingFire],
//     });
//
//     expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       expect.objectContaining({ hand: 3, discard: 0 }),
//     );
//
//     const cardDiscarded1 = testEngine.getCardModel(letTheStormRageOn);
//     const cardDiscarded2 = testEngine.getCardModel(strengthOfARagingFire);
//
//     await testEngine.playCard(shereKhanInfamousTiger);
//
//     expect(testEngine.getCardModel(letTheStormRageOn).zone).toEqual("discard");
//     expect(testEngine.getCardModel(strengthOfARagingFire).zone).toEqual(
//       "discard",
//     );
//
//     expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       expect.objectContaining({ hand: 0, discard: 3 }),
//     );
//   });
// });
//
