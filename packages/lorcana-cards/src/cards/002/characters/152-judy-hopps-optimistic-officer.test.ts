// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { judyHoppsOptimisticOfficer } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { gumboPot } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Judy Hopps - Optimistic Officer", () => {
//   describe("**DON'T CALL ME CUTE** When you play this character, you may banish chosen item. Its player draws a card.", () => {
//     it("banishing your own item", () => {
//       const testStore = new TestStore({
//         inkwell: judyHoppsOptimisticOfficer.cost,
//         hand: [judyHoppsOptimisticOfficer],
//         play: [gumboPot],
//         deck: 2,
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         judyHoppsOptimisticOfficer.id,
//       );
//       const target = testStore.getByZoneAndId("play", gumboPot.id);
//
//       cardUnderTest.playFromHand();
//       testStore.resolveOptionalAbility();
//       testStore.resolveTopOfStack({ targets: [target] });
//
//       expect(target.zone).toEqual("discard");
//       expect(testStore.getZonesCardCount()).toEqual(
//         expect.objectContaining({
//           hand: 1,
//           deck: 1,
//           discard: 1,
//           play: 1,
//         }),
//       );
//     });
//
//     it("banishing your opponent's item", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: judyHoppsOptimisticOfficer.cost,
//           hand: [judyHoppsOptimisticOfficer],
//           deck: 3,
//         },
//         {
//           play: [gumboPot],
//           deck: 2,
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         judyHoppsOptimisticOfficer.id,
//       );
//       const target = testStore.getByZoneAndId(
//         "play",
//         gumboPot.id,
//         "player_two",
//       );
//
//       cardUnderTest.playFromHand();
//       testStore.resolveOptionalAbility();
//       testStore.resolveTopOfStack({ targets: [target] });
//
//       expect(target.zone).toEqual("discard");
//
//       expect(testStore.getZonesCardCount()).toEqual(
//         expect.objectContaining({
//           hand: 0,
//           deck: 3,
//           discard: 0,
//           play: 1,
//         }),
//       );
//       expect(testStore.getZonesCardCount("player_two")).toEqual(
//         expect.objectContaining({
//           hand: 1,
//           deck: 1,
//           discard: 1,
//         }),
//       );
//     });
//   });
// });
//
