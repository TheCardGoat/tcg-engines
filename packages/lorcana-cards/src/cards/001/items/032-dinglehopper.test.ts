// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dinglehopper", () => {
//   It("STRAIGHTEN HAIR - healing 1 damage", () => {
//     Const testStore = new TestStore({
//       Play: [dingleHopper, magicBroomBucketBrigade],
//     });
//
//     Const damagedChar = testStore.getByZoneAndId(
//       "play",
//       MagicBroomBucketBrigade.id,
//     );
//     DamagedChar.updateCardMeta({ damage: 1 });
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 1 }));
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", dingleHopper.id);
//
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     CardUnderTest.activate();
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//
//     Const effect = testStore.store.stackLayerStore.layers[0];
//     If (effect) {
//       TestStore.resolveTopOfStack({
//         Targets: [damagedChar],
//       });
//     }
//
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 0 }));
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
//
//   It("STRAIGHTEN HAIR - healing 0 damage", () => {
//     Const testStore = new TestStore({
//       Play: [dingleHopper, magicBroomBucketBrigade],
//     });
//
//     Const damagedChar = testStore.getByZoneAndId(
//       "play",
//       MagicBroomBucketBrigade.id,
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", dingleHopper.id);
//
//     CardUnderTest.activate();
//
//     Const effect = testStore.store.stackLayerStore.layers[0];
//     If (effect) {
//       TestStore.resolveTopOfStack({
//         Targets: [damagedChar],
//       });
//     }
//
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta.damage,
//     ).toBeFalsy();
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
