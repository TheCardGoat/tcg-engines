// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { improvise } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Improvise", () => {
//   It.skip("Chosen character gets +1 {S} this turn. Draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: improvise.cost,
//       Play: [improvise],
//       Hand: [improvise],
//     });
//
//     Await testEngine.playCard(improvise);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
