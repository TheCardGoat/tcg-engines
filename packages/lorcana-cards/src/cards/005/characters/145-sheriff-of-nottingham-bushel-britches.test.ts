// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { sheriffOfNottinghamBushelBritches } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sheriff of Nottingham - Bushel Britches", () => {
//   It("**EVERY LITTLE BIT HELPS** For each item you have in play, you pay 1 {I} less to play this character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: sheriffOfNottinghamBushelBritches.cost,
//       Hand: [sheriffOfNottinghamBushelBritches],
//       Play: [pawpsicle, pawpsicle, pawpsicle],
//     });
//
//     Const cardUnderTest = testStore.getCard(sheriffOfNottinghamBushelBritches);
//
//     CardUnderTest.playFromHand();
//     Expect(cardUnderTest.zone).toEqual("play");
//     Expect(testStore.getAvailableInkwellCardCount()).toEqual(3);
//   });
// });
//
