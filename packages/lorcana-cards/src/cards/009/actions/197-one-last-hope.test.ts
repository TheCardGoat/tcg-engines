// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { oneLastHope } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("One Last Hope", () => {
//   It.skip("_(A character with cost 3 or more can {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: oneLastHope.cost,
//       Play: [oneLastHope],
//       Hand: [oneLastHope],
//     });
//
//     Await testEngine.playCard(oneLastHope);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: oneLastHope.cost,
//       Play: [oneLastHope],
//       Hand: [oneLastHope],
//     });
//
//     Await testEngine.playCard(oneLastHope);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
