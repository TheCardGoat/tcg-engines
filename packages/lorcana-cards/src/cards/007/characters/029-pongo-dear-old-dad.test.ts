// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FrecklesGoodBoy,
//   LuckyRuntOfTheLitter,
//   PerditaPlayfulMother,
//   PongoDearOldDad,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pongo - Dear Old Dad", () => {
//   It("FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.", async () => {
//     Const testEngine = new TestEngine(
//       {},
//       {
//         Inkwell: [frecklesGoodBoy, perditaPlayfulMother, luckyRuntOfTheLitter],
//         Play: [pongoDearOldDad],
//         Hand: [pongoDearOldDad],
//       },
//     );
//
//     Await testEngine.passTurn();
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [luckyRuntOfTheLitter] });
//
//     Expect(testEngine.getCardModel(luckyRuntOfTheLitter).zone).toBe("play");
//   });
// });
//
