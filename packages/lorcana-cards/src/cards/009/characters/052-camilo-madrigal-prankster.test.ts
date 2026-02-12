// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { camiloMadrigalPrankster } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Camilo Madrigal - Prankster", () => {
//   It.skip("**MANY FORMS** At the start of your turn, you may chose one:", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: camiloMadrigalPrankster.cost,
//       Play: [camiloMadrigalPrankster],
//       Hand: [camiloMadrigalPrankster],
//     });
//
//     Await testEngine.playCard(camiloMadrigalPrankster);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("• This character gets +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: camiloMadrigalPrankster.cost,
//       Play: [camiloMadrigalPrankster],
//       Hand: [camiloMadrigalPrankster],
//     });
//
//     Await testEngine.playCard(camiloMadrigalPrankster);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: camiloMadrigalPrankster.cost,
//       Play: [camiloMadrigalPrankster],
//       Hand: [camiloMadrigalPrankster],
//     });
//
//     Await testEngine.playCard(camiloMadrigalPrankster);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
