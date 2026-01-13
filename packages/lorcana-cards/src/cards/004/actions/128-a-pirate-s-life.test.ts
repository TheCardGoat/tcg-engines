// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("A Pirate's Life", () => {
//   it("Each opponent loses 2 lore. You gain 2 lore.", async () => {
//     const testStore = new TestEngine(
//       {
//         inkwell: aPiratesLife.cost,
//         hand: [aPiratesLife],
//         lore: 0,
//       },
//       {
//         lore: 5,
//       },
//     );
//
//     await testStore.playCard(aPiratesLife);
//
//     // Verify opponent loses 2 lore
//     expect(testStore.store.tableStore.getTable("player_two").lore).toBe(3);
//     // Verify player gains 2 lore (starting lore is 0, so should be 2)
//     expect(testStore.store.tableStore.getTable("player_one").lore).toBe(2);
//   });
// });
//
