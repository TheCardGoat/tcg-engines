// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielTreasureCollector,
//   PeteRottenGuy,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { fortisphere } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ariel - Treasure Collector", () => {
//   Describe("** THE GIRLS WHO HAS EVERYTHING** While you have more items in play than each opponent, this character gets +2 {L}.", () => {
//     It("should give +2 {L} when you have more items in play than each opponent", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [arielTreasureCollector, fortisphere],
//         },
//         {
//           Play: [peteRottenGuy],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ArielTreasureCollector.id,
//       );
//       Expect(cardUnderTest.lore).toBe(arielTreasureCollector.lore + 2);
//     });
//   });
// });
//
