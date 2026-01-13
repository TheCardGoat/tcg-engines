// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { undermine } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Undermine", () => {
//   it.skip("Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: undermine.cost,
//       play: [undermine],
//       hand: [undermine],
//     });
//
//     await testEngine.playCard(undermine);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
