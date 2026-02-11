// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { theWhiteRoseGemOfTheGarden } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The White Rose - Gem of the Garden", () => {
//   It.skip("THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theWhiteRoseGemOfTheGarden.cost,
//       Hand: [theWhiteRoseGemOfTheGarden],
//     });
//
//     Await testEngine.playCard(theWhiteRoseGemOfTheGarden);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
