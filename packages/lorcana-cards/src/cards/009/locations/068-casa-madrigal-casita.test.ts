// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { casaMadrigalCasita } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Casa Madrigal - Casita", () => {
//   It.skip("**OUR HOME** At the start of your turn, if you have a character here, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: casaMadrigalCasita.cost,
//       Play: [casaMadrigalCasita],
//       Hand: [casaMadrigalCasita],
//     });
//
//     Await testEngine.playCard(casaMadrigalCasita);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
