// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ratigansMarvelousTrap } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ratigan's Marvelous Trap", () => {
//   It("**SNAP! BOOM! TWANG!** Banish this item − Each opponent loses 2 lore.", () => {
//     Const initialLore = 3;
//
//     Const testStore = new TestStore(
//       {
//         Play: [ratigansMarvelousTrap],
//       },
//       {
//         Lore: initialLore,
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       RatigansMarvelousTrap.id,
//     );
//
//     CardUnderTest.activate();
//
//     Expect(cardUnderTest.zone).toEqual("discard");
//     Expect(testStore.getPlayerLore("player_two")).toEqual(initialLore - 2);
//   });
// });
//
