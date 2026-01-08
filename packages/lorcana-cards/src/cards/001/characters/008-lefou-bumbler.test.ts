// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, test } from "@jest/globals";
// import {
//   gastonArrogantHunter,
//   lefouBumbler,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Lefou - Bumbler", () => {
//   describe("**LOYAL** If you have a character named Gaston in play, you pay 1 {I} less to play this character.", () => {
//     test("Lefou costs 1 {I} if Gaston is in play", () => {
//       const testStore = new TestStore({
//         inkwell: lefouBumbler.cost - 1,
//         hand: [lefouBumbler],
//         play: [gastonArrogantHunter],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId("hand", lefouBumbler.id);
//
//       expect(cardUnderTest.cost).toEqual(lefouBumbler.cost - 1);
//
//       cardUnderTest.playFromHand();
//
//       expect(cardUnderTest.zone).toEqual("play");
//       expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//     });
//
//     test("Lefou costs 2 {I} if Gaston is NOT in play", () => {
//       const testStore = new TestStore({
//         inkwell: lefouBumbler.cost - 1,
//         hand: [lefouBumbler],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId("hand", lefouBumbler.id);
//
//       expect(cardUnderTest.cost).toEqual(lefouBumbler.cost);
//
//       cardUnderTest.playFromHand();
//
//       expect(cardUnderTest.zone).toEqual("hand");
//     });
//   });
// });
//
