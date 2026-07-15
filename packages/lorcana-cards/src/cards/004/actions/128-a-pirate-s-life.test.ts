// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("A Pirate's Life", () => {
//   It("Each opponent loses 2 lore. You gain 2 lore.", async () => {
//     Const testStore = new TestEngine(
//       {
//         Inkwell: aPiratesLife.cost,
//         Hand: [aPiratesLife],
//         Lore: 0,
//       },
//       {
//         Lore: 5,
//       },
//     );
//
//     Await testStore.playCard(aPiratesLife);
//
//     // Verify opponent loses 2 lore
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(3);
//     // Verify player gains 2 lore (starting lore is 0, so should be 2)
//     Expect(testStore.store.tableStore.getTable("player_one").lore).toBe(2);
//   });
// });
//
