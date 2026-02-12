// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fishboneQuill } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { touchedMyHeart } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Touched My Heart", () => {
//   It("_(A character with cost 2 or more can {E} to sing this song for free.)_Banish chosen item.", () => {
//     Const testStore = new TestStore({
//       Inkwell: touchedMyHeart.cost,
//       Hand: [touchedMyHeart],
//       Play: [fishboneQuill],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", touchedMyHeart.id);
//     Const targetItem = testStore.getByZoneAndId("play", fishboneQuill.id);
//
//     Expect(targetItem.zone).toBe("play");
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       Targets: [targetItem],
//     });
//
//     Expect(targetItem.zone).toBe("discard");
//     Expect(testStore.getZonesCardCount().play).toBe(0);
//     Expect(testStore.getZonesCardCount().discard).toBe(2); // item + action card
//   });
// });
//
