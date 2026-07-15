// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuckCoinCollector,
//   KhanWarHorse,
//   TheNephewsPiggyBank,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Donald Duck - Coin Collector", () => {
//   It("HERE, PIGGY, PIGGY For each item named The Nephews' Piggy Bank you have in play, you pay 2 {I} less to play this character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: donaldDuckCoinCollector.cost + theNephewsPiggyBank.cost,
//       Hand: [donaldDuckCoinCollector, theNephewsPiggyBank],
//     });
//
//     Expect(testEngine.getCardModel(donaldDuckCoinCollector).cost).toBe(
//       DonaldDuckCoinCollector.cost,
//     );
//
//     Await testEngine.playCard(theNephewsPiggyBank);
//
//     Expect(testEngine.getCardModel(donaldDuckCoinCollector).cost).toBe(
//       DonaldDuckCoinCollector.cost - 2,
//     );
//   });
//
//   It("MONEY EVERYWHERE When you play this character, your other characters gain '{E} – Draw a card' this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: donaldDuckCoinCollector.cost,
//       Play: [khanWarHorse],
//       Hand: [donaldDuckCoinCollector],
//       Deck: 10,
//     });
//
//     Expect(
//       TestEngine.getCardModel(khanWarHorse).activatedAbilities,
//     ).toHaveLength(0);
//
//     Await testEngine.playCard(donaldDuckCoinCollector);
//
//     Await testEngine.activateCard(khanWarHorse);
//
//     Expect(testEngine.getCardModel(khanWarHorse).ready).toBe(false);
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//     Expect(testEngine.getZonesCardCount().deck).toBe(9);
//   });
// });
//
