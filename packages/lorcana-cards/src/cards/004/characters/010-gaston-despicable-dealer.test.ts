// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mufasaBetrayedLeader } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { gastonDespicableDealer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gaston - Despicable Dealer", () => {
//   Describe("**DUBIOUS RECRUITMENT**  {E} − You pay 2 {I} less for the next character you play this turn.", () => {
//     It("should reduce the cost of the next character played by 2", () => {
//       Const testStore = new TestStore({
//         Inkwell: mufasaBetrayedLeader.cost - 2,
//         Play: [gastonDespicableDealer],
//         Hand: [mufasaBetrayedLeader],
//       });
//
//       Expect(
//         TestStore.store.continuousEffectStore.continuousEffects,
//       ).toHaveLength(0);
//
//       Const target = testStore.getCard(mufasaBetrayedLeader);
//
//       Target.playFromHand();
//       Expect(target.cost).toBe(5);
//       Expect(target.zone).toBe("hand");
//
//       Const cardUnderTest = testStore.getCard(gastonDespicableDealer);
//       CardUnderTest.activate();
//
//       Target.playFromHand();
//       Expect(target.zone).toBe("play");
//       Expect(
//         TestStore.store.continuousEffectStore.continuousEffects,
//       ).toHaveLength(0);
//     });
//
//     It("Effect should last only for the turn", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: mufasaBetrayedLeader.cost - 2,
//           Play: [gastonDespicableDealer],
//           Hand: [mufasaBetrayedLeader],
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(gastonDespicableDealer);
//
//       CardUnderTest.activate();
//       Expect(
//         TestStore.store.continuousEffectStore.continuousEffects,
//       ).toHaveLength(1);
//       TestStore.passTurn();
//       Expect(
//         TestStore.store.continuousEffectStore.continuousEffects,
//       ).toHaveLength(0);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("should cost 3 lore", () => {
//     Const testStore = new TestStore({
//       Inkwell: 3,
//       Hand: [gastonDespicableDealer],
//     });
//
//     Const cardUnderTest = testStore.getCard(gastonDespicableDealer);
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
//   });
// });
//
