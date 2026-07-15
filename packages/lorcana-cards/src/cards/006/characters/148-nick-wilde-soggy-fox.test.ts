// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { nickWildeSoggyFox } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nick Wilde - Soggy Fox", () => {
//   It.skip("NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: nickWildeSoggyFox.cost,
//       Play: [nickWildeSoggyFox],
//       Hand: [nickWildeSoggyFox],
//     });
//
//     Await testEngine.playCard(nickWildeSoggyFox);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
