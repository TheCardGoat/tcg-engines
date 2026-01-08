// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { improvise } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Improvise", () => {
//   it.skip("Chosen character gets +1 {S} this turn. Draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: improvise.cost,
//       play: [improvise],
//       hand: [improvise],
//     });
//
//     await testEngine.playCard(improvise);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
