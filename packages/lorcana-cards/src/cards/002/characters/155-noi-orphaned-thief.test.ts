// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { noiOrphanedThief } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Noi - Orphaned Thief", () => {
//   Describe("**HIDE AND SEEK** While you have an item in play, this character gains **Resist** +1 and **Ward**. _(Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)_", () => {
//     It("item in play", () => {
//       Const testStore = new TestStore({
//         Play: [noiOrphanedThief, pawpsicle],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         NoiOrphanedThief.id,
//       );
//
//       Expect(cardUnderTest.hasResist).toBe(true);
//       Expect(cardUnderTest.hasWard).toBe(true);
//     });
//
//     It("NO item in play", () => {
//       Const testStore = new TestStore({
//         Play: [noiOrphanedThief],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         NoiOrphanedThief.id,
//       );
//
//       Expect(cardUnderTest.hasResist).toBe(false);
//       Expect(cardUnderTest.hasWard).toBe(false);
//     });
//   });
// });
//
