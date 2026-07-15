// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { theQueenMirrorSeeker } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Queen - Mirror Seeker", () => {
//   It.skip("**CALCULATING AND VAIN** Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theQueenMirrorSeeker.cost,
//       Play: [theQueenMirrorSeeker],
//       Hand: [theQueenMirrorSeeker],
//     });
//
//     Await testEngine.playCard(theQueenMirrorSeeker);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
