// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { undermine } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Undermine", () => {
//   It.skip("Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: undermine.cost,
//       Play: [undermine],
//       Hand: [undermine],
//     });
//
//     Await testEngine.playCard(undermine);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
