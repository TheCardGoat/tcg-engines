// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fryingPan } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { touchedMyHeart } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Has Set My Heaaaaaaart ...", () => {
//   It("Banish chosen item.", () => {
//     Const testStore = new TestStore({
//       Inkwell: touchedMyHeart.cost,
//       Hand: [touchedMyHeart],
//       Play: [fryingPan],
//     });
//
//     Const cardUnderTest = testStore.getCard(touchedMyHeart);
//     Const targetItem = testStore.getByZoneAndId("play", fryingPan.id);
//
//     Expect(targetItem.zone).toBe("play");
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({
//       Targets: [targetItem],
//     });
//
//     Expect(targetItem.zone).toBe("discard");
//   });
// });
//
