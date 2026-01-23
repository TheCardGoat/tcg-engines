// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { vanellopeVonSchweetzGutsyGogetter } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Vanellope Von Schweetz - Gutsy Go-Getter", () => {
//   it.skip("AS READY AS I'LL EVER BE At the start of your turn, if this character is at a location, draw a card and gain 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: vanellopeVonSchweetzGutsyGogetter.cost,
//       play: [vanellopeVonSchweetzGutsyGogetter],
//       hand: [vanellopeVonSchweetzGutsyGogetter],
//     });
//
//     await testEngine.playCard(vanellopeVonSchweetzGutsyGogetter);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
