// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { theWhiteRoseGemOfTheGarden } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The White Rose - Gem of the Garden", () => {
//   it.skip("THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: theWhiteRoseGemOfTheGarden.cost,
//       hand: [theWhiteRoseGemOfTheGarden],
//     });
//
//     await testEngine.playCard(theWhiteRoseGemOfTheGarden);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
