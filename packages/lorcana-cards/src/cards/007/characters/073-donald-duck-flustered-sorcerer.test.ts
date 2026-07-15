// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { donaldDuckFlusteredSorcerer } from "./073-donald-duck-flustered-sorcerer";
//
// Describe.skip("Donald Duck - Flustered Sorcerer", () => {
//   It.skip("OBFUSCATE! Opponents need 25 lore to win the game.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: donaldDuckFlusteredSorcerer.cost,
//         Play: [donaldDuckFlusteredSorcerer],
//       },
//       {
//         Lore: 20, // Default win condition is 20
//       },
//     );
//
//     //expect(testEngine.getGameState().loreToWin["player_two"]).toBe(25);
//   });
// });
//
