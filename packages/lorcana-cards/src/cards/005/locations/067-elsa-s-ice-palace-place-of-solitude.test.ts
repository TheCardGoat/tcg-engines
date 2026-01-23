// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { elsasIcePalacePlaceOfSolitude } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Elsa's Ice Palace - Place of Solitude", () => {
//   it("**ETERNAL WINTER** When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: elsasIcePalacePlaceOfSolitude.cost,
//         hand: [elsasIcePalacePlaceOfSolitude],
//       },
//       {
//         play: [mickeyMouseMusketeer],
//       },
//     );
//
//     await testEngine.exertCard(mickeyMouseMusketeer);
//     await testEngine.playCard(elsasIcePalacePlaceOfSolitude);
//
//     await testEngine.resolveTopOfStack({
//       targets: [mickeyMouseMusketeer],
//     });
//
//     await testEngine.passTurn();
//
//     expect(testEngine.getCardModel(mickeyMouseMusketeer).ready).toBe(false);
//
//     await testEngine.passTurn();
//     await testEngine.passTurn();
//
//     expect(testEngine.getCardModel(mickeyMouseMusketeer).ready).toBe(false);
//
//     await testEngine.passTurn();
//     await testEngine.passTurn();
//
//     expect(testEngine.getCardModel(mickeyMouseMusketeer).ready).toBe(false);
//   });
// });
//
