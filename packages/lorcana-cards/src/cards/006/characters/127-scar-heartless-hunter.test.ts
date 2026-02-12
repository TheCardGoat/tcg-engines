// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { scarHeartlessHunter } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scar - Heartless Hunter", () => {
//   It.skip("BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: scarHeartlessHunter.cost,
//       Hand: [scarHeartlessHunter],
//     });
//
//     Await testEngine.playCard(scarHeartlessHunter);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
