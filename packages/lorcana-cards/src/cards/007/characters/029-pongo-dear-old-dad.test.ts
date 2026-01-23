// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   frecklesGoodBoy,
//   luckyRuntOfTheLitter,
//   perditaPlayfulMother,
//   pongoDearOldDad,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pongo - Dear Old Dad", () => {
//   it("FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.", async () => {
//     const testEngine = new TestEngine(
//       {},
//       {
//         inkwell: [frecklesGoodBoy, perditaPlayfulMother, luckyRuntOfTheLitter],
//         play: [pongoDearOldDad],
//         hand: [pongoDearOldDad],
//       },
//     );
//
//     await testEngine.passTurn();
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [luckyRuntOfTheLitter] });
//
//     expect(testEngine.getCardModel(luckyRuntOfTheLitter).zone).toBe("play");
//   });
// });
//
