// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { teKaTheBurningOne } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { swordOfTruth } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sword of Truth", () => {
//   It("**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.", () => {
//     Const testStore = new TestStore({
//       Play: [swordOfTruth, teKaTheBurningOne],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", swordOfTruth.id);
//     Const target = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//     CardUnderTest.activate();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("discard");
//     Expect(cardUnderTest.zone).toEqual("discard");
//   });
// });
//
