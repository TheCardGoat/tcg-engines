// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { beOurGuest } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Be Our Guest", () => {
//   it.skip("Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: beOurGuest.cost,
//       play: [beOurGuest],
//       hand: [beOurGuest],
//     });
//
//     await testEngine.playCard(beOurGuest);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
