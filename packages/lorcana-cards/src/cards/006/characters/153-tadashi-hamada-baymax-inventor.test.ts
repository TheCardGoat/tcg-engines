// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { tadashiHamadaBaymaxInventor } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tadashi Hamada - Baymax Inventor", () => {
//   It.skip("LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: tadashiHamadaBaymaxInventor.cost,
//       Play: [tadashiHamadaBaymaxInventor],
//       Hand: [tadashiHamadaBaymaxInventor],
//     });
//
//     Await testEngine.playCard(tadashiHamadaBaymaxInventor);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
