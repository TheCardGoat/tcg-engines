// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { monstroWhaleOfAWhale } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   DeweyLovableShowoff,
//   TrampDapperRascal,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tramp - Dapper Rascal", () => {
//   It.skip("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Tramp.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [trampDapperRascal],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(trampDapperRascal);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("PLAY IT COOL During an opponent’s turn, whenever one of your characters is banished, you may draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [trampDapperRascal, deweyLovableShowoff],
//       },
//       {
//         Play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     Const attacker = testEngine.getCardModel(monstroWhaleOfAWhale);
//     // const cardUnderTest = testEngine.getCardModel(trampDapperRascal);
//     Const cardToBanish = testEngine.getCardModel(deweyLovableShowoff);
//
//     TestEngine.questCard(cardToBanish);
//
//     Await testEngine.passTurn();
//
//     Await testEngine.challenge({
//       Attacker: attacker,
//       Defender: cardToBanish,
//     });
//
//     TestEngine.changeActivePlayer();
//     Await testEngine.resolveOptionalAbility();
//
//     TestEngine.getCardsByZone("hand", "player_one");
//     // await testEngine.resolveTopOfStack({});
//   });
// });
//
