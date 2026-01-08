// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { casaMadrigalCasita } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Casa Madrigal - Casita", () => {
//   it.skip("**OUR HOME** At the start of your turn, if you have a character here, gain 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: casaMadrigalCasita.cost,
//       play: [casaMadrigalCasita],
//       hand: [casaMadrigalCasita],
//     });
//
//     await testEngine.playCard(casaMadrigalCasita);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
