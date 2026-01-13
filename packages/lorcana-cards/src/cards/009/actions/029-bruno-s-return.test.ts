// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { brunosReturn } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bruno's Return", () => {
//   it.skip("Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: brunosReturn.cost,
//       play: [brunosReturn],
//       hand: [brunosReturn],
//     });
//
//     await testEngine.playCard(brunosReturn);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
