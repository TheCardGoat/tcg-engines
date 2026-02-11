// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { healingGlow } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("HealingGlow", () => {
//   It("healing 2 damage", () => {
//     Const testStore = new TestStore({
//       Inkwell: healingGlow.cost,
//       Hand: [healingGlow],
//       Play: [magicBroomBucketBrigade],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", healingGlow.id);
//     Const target = testStore.getByZoneAndId("play", magicBroomBucketBrigade.id);
//     Target.updateCardMeta({ damage: 2 });
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 2 }));
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 0 }));
//   });
//
//   It("healing 1 damage", () => {
//     Const testStore = new TestStore({
//       Inkwell: healingGlow.cost,
//       Hand: [healingGlow],
//       Play: [magicBroomBucketBrigade],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", healingGlow.id);
//     Const target = testStore.getByZoneAndId("play", magicBroomBucketBrigade.id);
//     Target.updateCardMeta({ damage: 1 });
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 1 }));
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 0 }));
//   });
//
//   It("healing 0 damage", () => {
//     Const testStore = new TestStore({
//       Inkwell: healingGlow.cost,
//       Hand: [healingGlow],
//       Play: [magicBroomBucketBrigade],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", healingGlow.id);
//     Const target = testStore.getByZoneAndId("play", magicBroomBucketBrigade.id);
//     Target.updateCardMeta({ damage: 0 });
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 0 }));
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 0 }));
//   });
// });
//
