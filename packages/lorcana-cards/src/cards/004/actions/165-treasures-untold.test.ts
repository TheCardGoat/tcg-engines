// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DingleHopper,
//   ShieldOfVirtue,
// } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { treasuresUntold } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Treasures Untold", () => {
//   It("_(A character with cost 6 or more can {E} to sing this song for free.)_Return up to 2 item cards from your discard into your hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: treasuresUntold.cost,
//       Hand: [treasuresUntold],
//       Discard: [shieldOfVirtue, dingleHopper],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", treasuresUntold.id);
//     Const item1 = testStore.getByZoneAndId("discard", shieldOfVirtue.id);
//     Const item2 = testStore.getByZoneAndId("discard", dingleHopper.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [item1, item2] });
//
//     Expect(testStore.getZonesCardCount().hand).toBe(2);
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // Treasures Untold goes to discard
//     Expect(item1.zone).toBe("hand");
//     Expect(item2.zone).toBe("hand");
//   });
// });
//
