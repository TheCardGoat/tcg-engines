// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { judyHoppsOptimisticOfficer } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { gumboPot } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Judy Hopps - Optimistic Officer", () => {
//   Describe("**DON'T CALL ME CUTE** When you play this character, you may banish chosen item. Its player draws a card.", () => {
//     It("banishing your own item", () => {
//       Const testStore = new TestStore({
//         Inkwell: judyHoppsOptimisticOfficer.cost,
//         Hand: [judyHoppsOptimisticOfficer],
//         Play: [gumboPot],
//         Deck: 2,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         JudyHoppsOptimisticOfficer.id,
//       );
//       Const target = testStore.getByZoneAndId("play", gumboPot.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 1,
//           Discard: 1,
//           Play: 1,
//         }),
//       );
//     });
//
//     It("banishing your opponent's item", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: judyHoppsOptimisticOfficer.cost,
//           Hand: [judyHoppsOptimisticOfficer],
//           Deck: 3,
//         },
//         {
//           Play: [gumboPot],
//           Deck: 2,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         JudyHoppsOptimisticOfficer.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         GumboPot.id,
//         "player_two",
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("discard");
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Deck: 3,
//           Discard: 0,
//           Play: 1,
//         }),
//       );
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 1,
//           Discard: 1,
//         }),
//       );
//     });
//   });
// });
//
