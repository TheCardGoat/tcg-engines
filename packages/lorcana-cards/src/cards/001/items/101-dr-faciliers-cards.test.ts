// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hesGotASword } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { drFacilierCards } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { reflection } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dr. Facilier's Cards", () => {
//   It("The Cards Will Tell - You pay 1 {I} less for the next action you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 1, // reflection costs 0 and hesGotASword costs 1
//       Hand: [reflection, hesGotASword],
//       Play: [drFacilierCards],
//     });
//
//     Const reducedCost = testStore.getByZoneAndId("hand", reflection.id);
//     Const normalCost = testStore.getByZoneAndId("hand", hesGotASword.id);
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", drFacilierCards.id);
//     CardUnderTest.activate();
//
//     ReducedCost.playFromHand();
//
//     Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(1);
//     Expect(reducedCost.zone).toEqual("discard");
//
//     NormalCost.playFromHand();
//
//     Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//     Expect(reducedCost.zone).toEqual("discard");
//   });
// });
//
