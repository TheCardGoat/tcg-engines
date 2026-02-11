// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { snowWhiteWellWisher } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { dragonGem } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Snow White - Well Wisher", () => {
//   Describe("**WISHES COME TRUE** Whenever this character quests, you may return a character card from your discard to your hand.", () => {
//     It("return character card to hand", () => {
//       Const testStore = new TestStore({
//         Inkwell: snowWhiteWellWisher.cost,
//         Discard: [snowWhiteWellWisher],
//         Hand: [],
//         Play: [snowWhiteWellWisher],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         SnowWhiteWellWisher.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "discard",
//         SnowWhiteWellWisher.id,
//       );
//
//       CardUnderTest.quest();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targetId: target.instanceId });
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Discard: 0,
//           Hand: 1,
//           Play: 1,
//         }),
//       );
//     });
//
//     It("no valid target", () => {
//       Const testStore = new TestStore({
//         Inkwell: snowWhiteWellWisher.cost,
//         Discard: [dragonGem],
//         Hand: [],
//         Play: [snowWhiteWellWisher],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         SnowWhiteWellWisher.id,
//       );
//
//       CardUnderTest.quest();
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Discard: 1,
//           Hand: 0,
//           Play: 1,
//         }),
//       );
//     });
//   });
// });
//
