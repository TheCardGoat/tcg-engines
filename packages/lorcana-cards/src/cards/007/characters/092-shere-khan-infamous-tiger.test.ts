// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LetTheStormRageOn,
//   StrengthOfARagingFire,
// } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { shereKhanInfamousTiger } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("IT IS REGRETTABLE When you play this character, discard your hand.", () => {
//   It.skip("", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: shereKhanInfamousTiger.cost,
//       Hand: [shereKhanInfamousTiger, letTheStormRageOn, strengthOfARagingFire],
//     });
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ hand: 3, discard: 0 }),
//     );
//
//     Const cardDiscarded1 = testEngine.getCardModel(letTheStormRageOn);
//     Const cardDiscarded2 = testEngine.getCardModel(strengthOfARagingFire);
//
//     Await testEngine.playCard(shereKhanInfamousTiger);
//
//     Expect(testEngine.getCardModel(letTheStormRageOn).zone).toEqual("discard");
//     Expect(testEngine.getCardModel(strengthOfARagingFire).zone).toEqual(
//       "discard",
//     );
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ hand: 0, discard: 3 }),
//     );
//   });
// });
//
