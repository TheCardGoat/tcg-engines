// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { theHornedKingWickedRuler } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { monstroWhaleOfAWhale } from "../../005/characters/052-monstro-whale-of-a-whale";
// import { charlotteLaBouffMardiGrasPrincess } from "../../008";
// import { deweyLovableShowoff } from "../../008/character/002-dewey-lovable-showoff";
//
// describe("The Horned King - Wicked Ruler", () => {
//   it("Shift 2 (You may pay 2 to play this on top of one of your characters named The Horned King.) ARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine({
//       play: [theHornedKingWickedRuler],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(theHornedKingWickedRuler);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("ARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [theHornedKingWickedRuler, deweyLovableShowoff],
//         hand: [charlotteLaBouffMardiGrasPrincess],
//       },
//       {
//         play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     const target = testEngine.getCardModel(deweyLovableShowoff);
//     const monstro = testEngine.getCardModel(monstroWhaleOfAWhale);
//     const charlotte = testEngine.getCardModel(
//       charlotteLaBouffMardiGrasPrincess,
//     );
//
//     await testEngine.exertCard(target);
//
//     await testEngine.passTurn();
//
//     await testEngine.challenge({
//       attacker: monstro,
//       defender: target,
//     });
//
//     await testEngine.changeActivePlayer("player_one");
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [charlotte] });
//
//     // Dewey returned to hand, charlotte discarded
//     expect(target.zone).toBe("hand");
//     expect(charlotte.zone).toBe("discard");
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//   });
//
//   it("ARISE! Can be skipped - when skipped, character stays banished and no card is discarded", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [theHornedKingWickedRuler, deweyLovableShowoff],
//         hand: [charlotteLaBouffMardiGrasPrincess],
//       },
//       {
//         play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     const target = testEngine.getCardModel(deweyLovableShowoff);
//     const monstro = testEngine.getCardModel(monstroWhaleOfAWhale);
//     const charlotte = testEngine.getCardModel(
//       charlotteLaBouffMardiGrasPrincess,
//     );
//
//     await testEngine.exertCard(target);
//
//     await testEngine.passTurn();
//
//     await testEngine.challenge({
//       attacker: monstro,
//       defender: target,
//     });
//
//     await testEngine.changeActivePlayer("player_one");
//
//     // Skip the optional ability
//     await testEngine.skipTopOfStack();
//
//     // Dewey stays in discard, charlotte stays in hand
//     expect(target.zone).toBe("discard");
//     expect(charlotte.zone).toBe("hand");
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//   });
// });
//
