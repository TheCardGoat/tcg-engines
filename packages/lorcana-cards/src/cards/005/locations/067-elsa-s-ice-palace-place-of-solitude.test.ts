// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { elsasIcePalacePlaceOfSolitude } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Elsa's Ice Palace - Place of Solitude", () => {
//   It("**ETERNAL WINTER** When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: elsasIcePalacePlaceOfSolitude.cost,
//         Hand: [elsasIcePalacePlaceOfSolitude],
//       },
//       {
//         Play: [mickeyMouseMusketeer],
//       },
//     );
//
//     Await testEngine.exertCard(mickeyMouseMusketeer);
//     Await testEngine.playCard(elsasIcePalacePlaceOfSolitude);
//
//     Await testEngine.resolveTopOfStack({
//       Targets: [mickeyMouseMusketeer],
//     });
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(mickeyMouseMusketeer).ready).toBe(false);
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(mickeyMouseMusketeer).ready).toBe(false);
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(mickeyMouseMusketeer).ready).toBe(false);
//   });
// });
//
