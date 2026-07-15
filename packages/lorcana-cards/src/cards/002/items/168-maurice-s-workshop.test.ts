// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GumboPot,
//   MauricesWorkshop,
// } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maurice's Workshop", () => {
//   It("**LOOKING FOR THIS?** Whenever you play another item, you may pay 1 {I} to draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mauricesWorkshop.cost + gumboPot.cost + 1,
//       Hand: [mauricesWorkshop, gumboPot],
//       Deck: 3,
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", mauricesWorkshop.id);
//     Const target = testStore.getByZoneAndId("hand", gumboPot.id);
//
//     CardUnderTest.playFromHand();
//     Expect(testStore.stackLayers).toHaveLength(0);
//
//     Target.playFromHand();
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 2,
//         Hand: 1,
//       }),
//     );
//   });
// });
//
