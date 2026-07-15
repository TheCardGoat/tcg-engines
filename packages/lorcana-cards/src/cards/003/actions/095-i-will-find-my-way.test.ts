// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { iWillFindMyWay } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("I Will Find My Way", () => {
//   It("_(A character with cost 1 or more can {E} to sing this song for free.)_Chosen character of yours gets +2 {S} this turn. They may move to a location for free.", () => {
//     Const testStore = new TestStore({
//       Inkwell: iWillFindMyWay.cost,
//       Hand: [iWillFindMyWay],
//       Play: [mickeyBraveLittleTailor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", iWillFindMyWay.id);
//     Const targetCharacter = testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // I Will Find My Way goes to discard
//   });
// });
//
