// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   RapunzelSunshine,
//   SnowWhiteWellWisher,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rapunzel - Sunshine", () => {
//   Describe("**MAGIC HAIR** {E} − Remove up to 2 damage from chosen character.", () => {
//     It("remove 2 damage", () => {
//       Const testStore = new TestStore({
//         Inkwell: rapunzelSunshine.cost,
//
//         Play: [rapunzelSunshine, snowWhiteWellWisher],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         RapunzelSunshine.id,
//       );
//       Const damagedChar = testStore.getByZoneAndId(
//         "play",
//         SnowWhiteWellWisher.id,
//       );
//       DamagedChar.updateCardDamage(2);
//       Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 2 }));
//
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       CardUnderTest.activate();
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//
//       Const effect = testStore.store.stackLayerStore.layers[0];
//       If (effect) {
//         TestStore.resolveTopOfStack({
//           Targets: [damagedChar],
//         });
//       }
//       Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 0 }));
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("remove 1 damage", () => {
//       Const testStore = new TestStore({
//         Inkwell: rapunzelSunshine.cost,
//
//         Play: [rapunzelSunshine, snowWhiteWellWisher],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         RapunzelSunshine.id,
//       );
//       Const damagedChar = testStore.getByZoneAndId(
//         "play",
//         SnowWhiteWellWisher.id,
//       );
//       DamagedChar.updateCardDamage(1);
//       Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 1 }));
//
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       CardUnderTest.activate();
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//
//       Const effect = testStore.store.stackLayerStore.layers[0];
//       If (effect) {
//         TestStore.resolveTopOfStack({
//           Targets: [damagedChar],
//         });
//       }
//       Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 0 }));
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//   });
// });
//
