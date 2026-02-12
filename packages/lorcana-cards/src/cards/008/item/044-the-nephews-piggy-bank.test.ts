// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donaldDuck } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   JumbaJookibaCriticalScientist,
//   TheNephewsPiggyBank,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Nephews' Piggy Bank", () => {
//   It("INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theNephewsPiggyBank.cost - 1,
//       Play: [donaldDuck],
//       Hand: [theNephewsPiggyBank],
//     });
//
//     Await testEngine.playCard(theNephewsPiggyBank);
//
//     Expect(testEngine.getCardModel(theNephewsPiggyBank).zone).toBe("play");
//   });
//
//   It("PAYOFF {e} – Chosen character gets -1 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [theNephewsPiggyBank],
//       },
//       {
//         Play: [jumbaJookibaCriticalScientist],
//       },
//     );
//
//     Await testEngine.activateCard(theNephewsPiggyBank, {
//       Targets: [jumbaJookibaCriticalScientist],
//     });
//
//     Expect(
//       TestEngine.getCardModel(jumbaJookibaCriticalScientist).strength,
//     ).toBe(jumbaJookibaCriticalScientist.strength - 1);
//
//     Await testEngine.passTurn();
//
//     Expect(
//       TestEngine.getCardModel(jumbaJookibaCriticalScientist).strength,
//     ).toBe(jumbaJookibaCriticalScientist.strength - 1);
//
//     Await testEngine.passTurn();
//
//     Expect(
//       TestEngine.getCardModel(jumbaJookibaCriticalScientist).strength,
//     ).toBe(jumbaJookibaCriticalScientist.strength);
//   });
// });
//
