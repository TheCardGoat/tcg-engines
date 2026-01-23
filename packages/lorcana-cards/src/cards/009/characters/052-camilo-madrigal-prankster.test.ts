// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { camiloMadrigalPrankster } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Camilo Madrigal - Prankster", () => {
//   it.skip("**MANY FORMS** At the start of your turn, you may chose one:", async () => {
//     const testEngine = new TestEngine({
//       inkwell: camiloMadrigalPrankster.cost,
//       play: [camiloMadrigalPrankster],
//       hand: [camiloMadrigalPrankster],
//     });
//
//     await testEngine.playCard(camiloMadrigalPrankster);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("• This character gets +1 {L} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: camiloMadrigalPrankster.cost,
//       play: [camiloMadrigalPrankster],
//       hand: [camiloMadrigalPrankster],
//     });
//
//     await testEngine.playCard(camiloMadrigalPrankster);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: camiloMadrigalPrankster.cost,
//       play: [camiloMadrigalPrankster],
//       hand: [camiloMadrigalPrankster],
//     });
//
//     await testEngine.playCard(camiloMadrigalPrankster);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
