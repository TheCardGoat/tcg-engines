// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { dinnerBell } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dinner Bell", () => {
//   it.skip("**YOU KNOW WHAT HAPPENS** {E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: dinnerBell.cost,
//       play: [dinnerBell],
//       hand: [dinnerBell],
//     });
//
//     await testEngine.playCard(dinnerBell);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
