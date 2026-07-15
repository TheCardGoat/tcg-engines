// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { vanellopeVonSchweetzGutsyGogetter } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Vanellope Von Schweetz - Gutsy Go-Getter", () => {
//   It.skip("AS READY AS I'LL EVER BE At the start of your turn, if this character is at a location, draw a card and gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: vanellopeVonSchweetzGutsyGogetter.cost,
//       Play: [vanellopeVonSchweetzGutsyGogetter],
//       Hand: [vanellopeVonSchweetzGutsyGogetter],
//     });
//
//     Await testEngine.playCard(vanellopeVonSchweetzGutsyGogetter);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
