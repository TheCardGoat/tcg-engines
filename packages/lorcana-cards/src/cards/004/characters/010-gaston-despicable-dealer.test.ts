// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mufasaBetrayedLeader } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { gastonDespicableDealer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Gaston - Despicable Dealer", () => {
//   describe("**DUBIOUS RECRUITMENT**  {E} − You pay 2 {I} less for the next character you play this turn.", () => {
//     it("should reduce the cost of the next character played by 2", () => {
//       const testStore = new TestStore({
//         inkwell: mufasaBetrayedLeader.cost - 2,
//         play: [gastonDespicableDealer],
//         hand: [mufasaBetrayedLeader],
//       });
//
//       expect(
//         testStore.store.continuousEffectStore.continuousEffects,
//       ).toHaveLength(0);
//
//       const target = testStore.getCard(mufasaBetrayedLeader);
//
//       target.playFromHand();
//       expect(target.cost).toBe(5);
//       expect(target.zone).toBe("hand");
//
//       const cardUnderTest = testStore.getCard(gastonDespicableDealer);
//       cardUnderTest.activate();
//
//       target.playFromHand();
//       expect(target.zone).toBe("play");
//       expect(
//         testStore.store.continuousEffectStore.continuousEffects,
//       ).toHaveLength(0);
//     });
//
//     it("Effect should last only for the turn", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: mufasaBetrayedLeader.cost - 2,
//           play: [gastonDespicableDealer],
//           hand: [mufasaBetrayedLeader],
//         },
//         {
//           deck: 1,
//         },
//       );
//
//       const cardUnderTest = testStore.getCard(gastonDespicableDealer);
//
//       cardUnderTest.activate();
//       expect(
//         testStore.store.continuousEffectStore.continuousEffects,
//       ).toHaveLength(1);
//       testStore.passTurn();
//       expect(
//         testStore.store.continuousEffectStore.continuousEffects,
//       ).toHaveLength(0);
//     });
//   });
// });
//
// describe("Regression", () => {
//   it("should cost 3 lore", () => {
//     const testStore = new TestStore({
//       inkwell: 3,
//       hand: [gastonDespicableDealer],
//     });
//
//     const cardUnderTest = testStore.getCard(gastonDespicableDealer);
//
//     cardUnderTest.playFromHand();
//
//     expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
//   });
// });
//
