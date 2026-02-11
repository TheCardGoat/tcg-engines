// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { jasmineDesertWarrior } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { princeAchmedRivalSuitor } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Prince Achmed - Rival Suitor", () => {
//   It("UNWELCOME PROPOSAL When you play this character, you may exert chosen Princess character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: princeAchmedRivalSuitor.cost,
//         Hand: [princeAchmedRivalSuitor],
//       },
//       {
//         Play: [jasmineDesertWarrior],
//         Hand: [],
//       },
//     );
//
//     Await testEngine.playCard(princeAchmedRivalSuitor, {
//       AcceptOptionalLayer: true,
//       Targets: [jasmineDesertWarrior],
//     });
//     Expect(testEngine.getCardModel(jasmineDesertWarrior).exerted).toBe(true);
//   });
// });
//
