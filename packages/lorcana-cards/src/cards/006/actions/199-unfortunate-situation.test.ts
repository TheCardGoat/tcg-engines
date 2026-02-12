// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { unfortunateSituation } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Unfortunate Situation", () => {
//   It.skip("Each opponent chooses one of their characters and deals 4 damage to them.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: unfortunateSituation.cost,
//       Play: [unfortunateSituation],
//       Hand: [unfortunateSituation],
//     });
//
//     Await testEngine.playCard(unfortunateSituation);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
