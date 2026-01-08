// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { theQueenMirrorSeeker } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Queen - Mirror Seeker", () => {
//   it.skip("**CALCULATING AND VAIN** Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: theQueenMirrorSeeker.cost,
//       play: [theQueenMirrorSeeker],
//       hand: [theQueenMirrorSeeker],
//     });
//
//     await testEngine.playCard(theQueenMirrorSeeker);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
