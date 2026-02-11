// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { tryEverything } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Try Everything", () => {
//   It.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: tryEverything.cost,
//       Hand: [tryEverything],
//     });
//
//     Const cardUnderTest = testStore.getCard(tryEverything);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("Remove up to 3 damage from chosen character and ready them. They can’t quest or challenge for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: tryEverything.cost,
//       Hand: [tryEverything],
//     });
//
//     Const cardUnderTest = testStore.getCard(tryEverything);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
