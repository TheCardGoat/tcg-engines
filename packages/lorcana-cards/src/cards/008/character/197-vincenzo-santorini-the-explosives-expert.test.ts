// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { kidaProtectorOfAtlantis } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { vincenzoSantoriniTheExplosivesExpert } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Vincenzo Santorini - The Explosives Expert", () => {
//   it("I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: vincenzoSantoriniTheExplosivesExpert.cost,
//         hand: [vincenzoSantoriniTheExplosivesExpert],
//       },
//       {
//         inkwell: 0,
//         play: [kidaProtectorOfAtlantis],
//       },
//     );
//
//     await testEngine.playCard(vincenzoSantoriniTheExplosivesExpert);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [kidaProtectorOfAtlantis] });
//     expect(testEngine.getCardModel(kidaProtectorOfAtlantis).damage).toBe(3);
//   });
// });
//
