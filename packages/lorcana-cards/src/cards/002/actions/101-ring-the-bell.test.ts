// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { ringTheBell } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ring The Bell", () => {
//   It("Banish chosen damaged character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: ringTheBell.cost,
//       Hand: [ringTheBell],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ringTheBell.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     Target.updateCardDamage(1);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       Targets: [target],
//     });
//
//     Expect(target.zone).toEqual("discard");
//   });
//
//   It("doest NOT Banish non damaged character", () => {
//     Const testStore = new TestStore({
//       Inkwell: ringTheBell.cost,
//       Hand: [ringTheBell],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ringTheBell.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       Targets: [target],
//     });
//
//     Expect(target.zone).toEqual("play");
//   });
// });
//
