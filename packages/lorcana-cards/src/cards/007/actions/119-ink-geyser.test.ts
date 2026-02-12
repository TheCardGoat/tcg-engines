// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { inkGeyser } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ink Geyser", () => {
//   Describe("Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.", () => {
//     It("Both have more than 3", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 7,
//           Hand: [inkGeyser],
//         },
//         {
//           Inkwell: 5,
//         },
//       );
//
//       Await testEngine.playCard(inkGeyser);
//
//       Expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(3);
//       Expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(3);
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(4);
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//     });
//
//     It("Only active player has", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 8,
//           Hand: [inkGeyser],
//         },
//         {
//           Inkwell: 2,
//         },
//       );
//
//       Await testEngine.playCard(inkGeyser);
//
//       Expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(3);
//       Expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(2);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(5);
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(0);
//     });
//
//     It("Only opponent has", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 3,
//           Hand: [inkGeyser],
//         },
//         {
//           Inkwell: 9,
//         },
//       );
//
//       Await testEngine.playCard(inkGeyser);
//
//       Expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(3);
//       Expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(3);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(6);
//     });
//   });
// });
//
