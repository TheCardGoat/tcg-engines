// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { inkGeyser } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ink Geyser", () => {
//   describe("Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.", () => {
//     it("Both have more than 3", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 7,
//           hand: [inkGeyser],
//         },
//         {
//           inkwell: 5,
//         },
//       );
//
//       await testEngine.playCard(inkGeyser);
//
//       expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(3);
//       expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(3);
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(4);
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//     });
//
//     it("Only active player has", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 8,
//           hand: [inkGeyser],
//         },
//         {
//           inkwell: 2,
//         },
//       );
//
//       await testEngine.playCard(inkGeyser);
//
//       expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(3);
//       expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(2);
//
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(5);
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(0);
//     });
//
//     it("Only opponent has", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 3,
//           hand: [inkGeyser],
//         },
//         {
//           inkwell: 9,
//         },
//       );
//
//       await testEngine.playCard(inkGeyser);
//
//       expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(3);
//       expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(3);
//
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(6);
//     });
//   });
// });
//
