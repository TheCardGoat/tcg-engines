// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { belleBookworm } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Belle - Bookworm", () => {
//   Describe("**USE YOUR IMAGINATION** While an opponent has no cards in their hand, this character gets +2 {L}.", () => {
//     It("No Cards in Hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [belleBookworm],
//         },
//         { hand: 0 },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", belleBookworm.id);
//
//       Expect(cardUnderTest.lore).toEqual(belleBookworm.lore + 2);
//     });
//
//     It("Cards in Hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [belleBookworm],
//         },
//         { hand: 1 },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", belleBookworm.id);
//
//       Expect(cardUnderTest.lore).toEqual(belleBookworm.lore);
//     });
//   });
// });
//
