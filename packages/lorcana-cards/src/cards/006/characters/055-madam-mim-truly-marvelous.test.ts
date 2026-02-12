// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { madamMimTrulyMarvelous } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Madam Mim - Truly Marvelous", () => {
//   It.skip("OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: madamMimTrulyMarvelous.cost,
//       Play: [madamMimTrulyMarvelous],
//       Hand: [madamMimTrulyMarvelous],
//     });
//
//     Await testEngine.playCard(madamMimTrulyMarvelous);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
