// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   StichtNewDog,
//   StitchRockStar,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Stitch Rock Star", () => {
//   Describe('"ADORING FANS - Whenever you play a character with cost 2 or less, you may exert them to draw a card.', () => {
//     It("Drawing cards", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Inkwell: stichtNewDog.cost + liloMakingAWish.cost,
//         Hand: [stichtNewDog, liloMakingAWish],
//         Play: [stitchRockStar],
//       });
//
//       Const aTarget = testStore.getByZoneAndId("hand", stichtNewDog.id);
//       Const anotherTarget = testStore.getByZoneAndId(
//         "hand",
//         LiloMakingAWish.id,
//       );
//
//       ATarget.playFromHand();
//       TestStore.resolveTopOfStack();
//
//       Expect(aTarget.ready).toEqual(false);
//       Expect(testStore.getZonesCardCount().deck).toBe(1);
//       Expect(testStore.getZonesCardCount().hand).toBe(2);
//
//       AnotherTarget.playFromHand();
//       TestStore.resolveTopOfStack({ targetId: anotherTarget.instanceId });
//
//       Expect(anotherTarget.meta.exerted).toEqual(true);
//       Expect(testStore.getZonesCardCount().deck).toBe(0);
//       Expect(testStore.getZonesCardCount().hand).toBe(2);
//       Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("Skipping effects", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Inkwell: stichtNewDog.cost + liloMakingAWish.cost,
//         Hand: [stichtNewDog, liloMakingAWish],
//         Play: [stitchRockStar],
//       });
//
//       Const aTarget = testStore.getByZoneAndId("hand", stichtNewDog.id);
//       Const anotherTarget = testStore.getByZoneAndId(
//         "hand",
//         LiloMakingAWish.id,
//       );
//
//       ATarget.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(aTarget.ready).toEqual(true);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ deck: 2, hand: 1, play: 2 }),
//       );
//
//       AnotherTarget.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(anotherTarget.ready).toEqual(true);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ deck: 2, hand: 0, play: 3 }),
//       );
//       Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//   });
// });
//
