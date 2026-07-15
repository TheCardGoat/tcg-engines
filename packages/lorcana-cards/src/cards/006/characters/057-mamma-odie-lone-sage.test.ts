// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mammaOdieLoneSage } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mamma Odie - Lone Sage", () => {
//   It.skip("I HAVE TO DO EVERYTHING AROUND HERE Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mammaOdieLoneSage.cost,
//       Play: [mammaOdieLoneSage],
//       Hand: [mammaOdieLoneSage],
//     });
//
//     Await testEngine.playCard(mammaOdieLoneSage);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
