// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { kidaProtectorOfAtlantis } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { vincenzoSantoriniTheExplosivesExpert } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Vincenzo Santorini - The Explosives Expert", () => {
//   It("I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: vincenzoSantoriniTheExplosivesExpert.cost,
//         Hand: [vincenzoSantoriniTheExplosivesExpert],
//       },
//       {
//         Inkwell: 0,
//         Play: [kidaProtectorOfAtlantis],
//       },
//     );
//
//     Await testEngine.playCard(vincenzoSantoriniTheExplosivesExpert);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [kidaProtectorOfAtlantis] });
//     Expect(testEngine.getCardModel(kidaProtectorOfAtlantis).damage).toBe(3);
//   });
// });
//
