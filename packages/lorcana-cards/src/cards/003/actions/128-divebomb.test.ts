// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { divebomb } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Divebomb", () => {
//   it.skip("Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.", () => {
//     const testStore = new TestStore({
//       inkwell: divebomb.cost,
//       hand: [divebomb],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", divebomb.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
