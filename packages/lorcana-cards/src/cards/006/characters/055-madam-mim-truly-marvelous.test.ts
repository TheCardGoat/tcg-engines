// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { madamMimTrulyMarvelous } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Madam Mim - Truly Marvelous", () => {
//   it.skip("OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: madamMimTrulyMarvelous.cost,
//       play: [madamMimTrulyMarvelous],
//       hand: [madamMimTrulyMarvelous],
//     });
//
//     await testEngine.playCard(madamMimTrulyMarvelous);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
