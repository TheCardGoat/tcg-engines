// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theHornedKingWickedRuler } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { monstroWhaleOfAWhale } from "../../005/characters/052-monstro-whale-of-a-whale";
// Import { charlotteLaBouffMardiGrasPrincess } from "../../008";
// Import { deweyLovableShowoff } from "../../008/character/002-dewey-lovable-showoff";
//
// Describe("The Horned King - Wicked Ruler", () => {
//   It("Shift 2 (You may pay 2 to play this on top of one of your characters named The Horned King.) ARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theHornedKingWickedRuler],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(theHornedKingWickedRuler);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("ARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [theHornedKingWickedRuler, deweyLovableShowoff],
//         Hand: [charlotteLaBouffMardiGrasPrincess],
//       },
//       {
//         Play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//     Const monstro = testEngine.getCardModel(monstroWhaleOfAWhale);
//     Const charlotte = testEngine.getCardModel(
//       CharlotteLaBouffMardiGrasPrincess,
//     );
//
//     Await testEngine.exertCard(target);
//
//     Await testEngine.passTurn();
//
//     Await testEngine.challenge({
//       Attacker: monstro,
//       Defender: target,
//     });
//
//     Await testEngine.changeActivePlayer("player_one");
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [charlotte] });
//
//     // Dewey returned to hand, charlotte discarded
//     Expect(target.zone).toBe("hand");
//     Expect(charlotte.zone).toBe("discard");
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//   });
//
//   It("ARISE! Can be skipped - when skipped, character stays banished and no card is discarded", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [theHornedKingWickedRuler, deweyLovableShowoff],
//         Hand: [charlotteLaBouffMardiGrasPrincess],
//       },
//       {
//         Play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//     Const monstro = testEngine.getCardModel(monstroWhaleOfAWhale);
//     Const charlotte = testEngine.getCardModel(
//       CharlotteLaBouffMardiGrasPrincess,
//     );
//
//     Await testEngine.exertCard(target);
//
//     Await testEngine.passTurn();
//
//     Await testEngine.challenge({
//       Attacker: monstro,
//       Defender: target,
//     });
//
//     Await testEngine.changeActivePlayer("player_one");
//
//     // Skip the optional ability
//     Await testEngine.skipTopOfStack();
//
//     // Dewey stays in discard, charlotte stays in hand
//     Expect(target.zone).toBe("discard");
//     Expect(charlotte.zone).toBe("hand");
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//   });
// });
//
