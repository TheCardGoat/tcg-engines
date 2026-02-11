// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { divebomb } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Divebomb", () => {
//   It.skip("Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: divebomb.cost,
//       Hand: [divebomb],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", divebomb.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
