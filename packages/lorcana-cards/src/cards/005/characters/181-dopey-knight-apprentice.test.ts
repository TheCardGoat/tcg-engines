// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dopeyAlwaysPlayful } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { dopeyKnightApprentice } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dopey - Knight Apprentice", () => {
//   describe("**STRONGER TOGETHER** When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.", () => {
//     it("Doesn't trigger when he's the only knight in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: dopeyKnightApprentice.cost,
//         hand: [dopeyKnightApprentice],
//         play: [dopeyAlwaysPlayful],
//       });
//
//       await testEngine.playCard(dopeyKnightApprentice);
//       expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
