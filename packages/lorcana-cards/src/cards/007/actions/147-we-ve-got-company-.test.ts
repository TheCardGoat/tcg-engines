// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { weveGotCompany } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("We've Got Company!", () => {
//   It.skip("Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: weveGotCompany.cost,
//       Play: [weveGotCompany],
//       Hand: [weveGotCompany],
//     });
//
//     Await testEngine.playCard(weveGotCompany);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
