// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { donaldDuckFlusteredSorcerer } from "./073-donald-duck-flustered-sorcerer";
//
// describe.skip("Donald Duck - Flustered Sorcerer", () => {
//   it.skip("OBFUSCATE! Opponents need 25 lore to win the game.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: donaldDuckFlusteredSorcerer.cost,
//         play: [donaldDuckFlusteredSorcerer],
//       },
//       {
//         lore: 20, // Default win condition is 20
//       },
//     );
//
//     //expect(testEngine.getGameState().loreToWin["player_two"]).toBe(25);
//   });
// });
//
