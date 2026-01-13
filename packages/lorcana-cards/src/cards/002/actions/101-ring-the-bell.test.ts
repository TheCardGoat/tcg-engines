// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { ringTheBell } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ring The Bell", () => {
//   it("Banish chosen damaged character.", () => {
//     const testStore = new TestStore({
//       inkwell: ringTheBell.cost,
//       hand: [ringTheBell],
//       play: [moanaOfMotunui],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", ringTheBell.id);
//     const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     target.updateCardDamage(1);
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveTopOfStack({
//       targets: [target],
//     });
//
//     expect(target.zone).toEqual("discard");
//   });
//
//   it("doest NOT Banish non damaged character", () => {
//     const testStore = new TestStore({
//       inkwell: ringTheBell.cost,
//       hand: [ringTheBell],
//       play: [moanaOfMotunui],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", ringTheBell.id);
//     const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveTopOfStack({
//       targets: [target],
//     });
//
//     expect(target.zone).toEqual("play");
//   });
// });
//
