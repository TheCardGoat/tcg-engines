// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { judyHoppsUncoveringClues } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Judy Hopps - Uncovering Clues", () => {
//   it.skip("THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: judyHoppsUncoveringClues.cost,
//       hand: [judyHoppsUncoveringClues],
//     });
//
//     await testEngine.playCard(judyHoppsUncoveringClues);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
