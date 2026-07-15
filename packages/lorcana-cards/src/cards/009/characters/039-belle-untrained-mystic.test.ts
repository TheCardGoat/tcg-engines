// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { belleUntrainedMystic } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Belle - Untrained Mystic", () => {
//   It.skip("**HERE NOW, DON'T DO THAT** When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: belleUntrainedMystic.cost,
//       Hand: [belleUntrainedMystic],
//     });
//
//     Await testEngine.playCard(belleUntrainedMystic);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
