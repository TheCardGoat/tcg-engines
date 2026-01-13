// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { mauiHalfshark } from "@lorcanito/lorcana-engine/cards/006/characters/124-maui-halfshark";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Maui - Half-Shark", () => {
//   it("WAYFINDING: Should gain 1 lore when playing an action, even if Maui is banished by that action", async () => {
//     const testEngine = new TestEngine({
//       inkwell: bePrepared.cost,
//       play: [mauiHalfshark],
//       hand: [bePrepared],
//     });
//
//     // Set lore to 19 as described in the bug report
//     testEngine.store.tableStore.getTable("player_one").updateLore(19);
//
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(19);
//
//     // Play Be Prepared - this should trigger Maui's Wayfinding ability
//     await testEngine.playCard(bePrepared);
//
//     // Be Prepared's effect (banish all characters) auto-resolves first,
//     // then Maui's Wayfinding trigger auto-resolves and gains 1 lore.
//     // The stack should be empty now since both abilities auto-resolved.
//
//     // Should have gained 1 lore from Maui's Wayfinding ability
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(20);
//   });
//
//   it("It shouldn't trigger if Maiu was already in the graveyard", async () => {
//     const testEngine = new TestEngine({
//       inkwell: bePrepared.cost,
//       discard: [mauiHalfshark],
//       hand: [bePrepared],
//     });
//
//     // Set lore to 19 as described in the bug report
//     testEngine.store.tableStore.getTable("player_one").updateLore(19);
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(19);
//     await testEngine.playCard(bePrepared);
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(19);
//   });
// });
//
