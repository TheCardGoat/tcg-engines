// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { mauiHalfshark } from "@lorcanito/lorcana-engine/cards/006/characters/124-maui-halfshark";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Maui - Half-Shark", () => {
//   It("WAYFINDING: Should gain 1 lore when playing an action, even if Maui is banished by that action", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: bePrepared.cost,
//       Play: [mauiHalfshark],
//       Hand: [bePrepared],
//     });
//
//     // Set lore to 19 as described in the bug report
//     TestEngine.store.tableStore.getTable("player_one").updateLore(19);
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(19);
//
//     // Play Be Prepared - this should trigger Maui's Wayfinding ability
//     Await testEngine.playCard(bePrepared);
//
//     // Be Prepared's effect (banish all characters) auto-resolves first,
//     // then Maui's Wayfinding trigger auto-resolves and gains 1 lore.
//     // The stack should be empty now since both abilities auto-resolved.
//
//     // Should have gained 1 lore from Maui's Wayfinding ability
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(20);
//   });
//
//   It("It shouldn't trigger if Maiu was already in the graveyard", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: bePrepared.cost,
//       Discard: [mauiHalfshark],
//       Hand: [bePrepared],
//     });
//
//     // Set lore to 19 as described in the bug report
//     TestEngine.store.tableStore.getTable("player_one").updateLore(19);
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(19);
//     Await testEngine.playCard(bePrepared);
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(19);
//   });
// });
//
