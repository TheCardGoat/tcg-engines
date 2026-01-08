// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { iWillFindMyWay } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("I Will Find My Way", () => {
//   it("_(A character with cost 1 or more can {E} to sing this song for free.)_Chosen character of yours gets +2 {S} this turn. They may move to a location for free.", () => {
//     const testStore = new TestStore({
//       inkwell: iWillFindMyWay.cost,
//       hand: [iWillFindMyWay],
//       play: [mickeyBraveLittleTailor],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", iWillFindMyWay.id);
//     const targetCharacter = testStore.getByZoneAndId(
//       "play",
//       mickeyBraveLittleTailor.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//     expect(testStore.getZonesCardCount().discard).toBe(1); // I Will Find My Way goes to discard
//   });
// });
//
