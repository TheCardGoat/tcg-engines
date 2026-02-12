// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { princeJohnFalseKing } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Prince John - False King", () => {
//   Describe("**COLLECT TAXES** Whenever this character quests, each opponent with more Lore than you loses 2 Lore.", () => {
//     It("Same lore", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [princeJohnFalseKing],
//           Lore: 8,
//         },
//         {
//           Lore: 10,
//         },
//       );
//
//       Await testEngine.questCard(princeJohnFalseKing);
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toEqual(
//         8 + princeJohnFalseKing.lore,
//       );
//       Expect(testEngine.getLoreForPlayer("player_two")).toEqual(10);
//     });
//
//     It("Opponent with more lore", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [princeJohnFalseKing],
//           Lore: 8,
//         },
//         {
//           Lore: 12,
//         },
//       );
//
//       Await testEngine.questCard(princeJohnFalseKing);
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toEqual(
//         8 + princeJohnFalseKing.lore,
//       );
//       Expect(testEngine.getLoreForPlayer("player_two")).toEqual(12 - 2);
//     });
//   });
// });
//
