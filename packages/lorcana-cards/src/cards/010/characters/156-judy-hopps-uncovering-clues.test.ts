// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { judyHoppsUncoveringClues } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Judy Hopps - Uncovering Clues", () => {
//   It.skip("THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: judyHoppsUncoveringClues.cost,
//       Hand: [judyHoppsUncoveringClues],
//     });
//
//     Await testEngine.playCard(judyHoppsUncoveringClues);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
