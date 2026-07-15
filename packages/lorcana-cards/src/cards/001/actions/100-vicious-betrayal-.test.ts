// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import { viciousBetrayal } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   MoanaOfMotunui,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Vicious Betrayal", () => {
//   It("[Non Villain] Chosen character gets +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: viciousBetrayal.cost,
//       Hand: [viciousBetrayal],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", viciousBetrayal.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
//   });
//
//   It("[Villain] Chosen character gets +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: viciousBetrayal.cost,
//       Hand: [viciousBetrayal],
//       Play: [teKaTheBurningOne],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", viciousBetrayal.id);
//     Const target = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 3);
//   });
// });
//
