// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   donaldDuckCoinCollector,
//   khanWarHorse,
//   theNephewsPiggyBank,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Donald Duck - Coin Collector", () => {
//   it("HERE, PIGGY, PIGGY For each item named The Nephews' Piggy Bank you have in play, you pay 2 {I} less to play this character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: donaldDuckCoinCollector.cost + theNephewsPiggyBank.cost,
//       hand: [donaldDuckCoinCollector, theNephewsPiggyBank],
//     });
//
//     expect(testEngine.getCardModel(donaldDuckCoinCollector).cost).toBe(
//       donaldDuckCoinCollector.cost,
//     );
//
//     await testEngine.playCard(theNephewsPiggyBank);
//
//     expect(testEngine.getCardModel(donaldDuckCoinCollector).cost).toBe(
//       donaldDuckCoinCollector.cost - 2,
//     );
//   });
//
//   it("MONEY EVERYWHERE When you play this character, your other characters gain '{E} – Draw a card' this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: donaldDuckCoinCollector.cost,
//       play: [khanWarHorse],
//       hand: [donaldDuckCoinCollector],
//       deck: 10,
//     });
//
//     expect(
//       testEngine.getCardModel(khanWarHorse).activatedAbilities,
//     ).toHaveLength(0);
//
//     await testEngine.playCard(donaldDuckCoinCollector);
//
//     await testEngine.activateCard(khanWarHorse);
//
//     expect(testEngine.getCardModel(khanWarHorse).ready).toBe(false);
//     expect(testEngine.getZonesCardCount().hand).toBe(1);
//     expect(testEngine.getZonesCardCount().deck).toBe(9);
//   });
// });
//
