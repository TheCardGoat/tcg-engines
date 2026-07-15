// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { showMeMore } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Show Me More!", () => {
//   It("Each player draws 3 cards", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: showMeMore.cost,
//         Hand: [showMeMore],
//         Deck: 5,
//       },
//       {
//         Deck: 5,
//       },
//     );
//
//     Await testEngine.playCard(showMeMore);
//
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//     Expect(testEngine.getZonesCardCount("player_two").hand).toBe(3);
//   });
// });
//
