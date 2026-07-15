// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dopeyAlwaysPlayful } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { dopeyKnightApprentice } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dopey - Knight Apprentice", () => {
//   Describe("**STRONGER TOGETHER** When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.", () => {
//     It("Doesn't trigger when he's the only knight in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: dopeyKnightApprentice.cost,
//         Hand: [dopeyKnightApprentice],
//         Play: [dopeyAlwaysPlayful],
//       });
//
//       Await testEngine.playCard(dopeyKnightApprentice);
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
