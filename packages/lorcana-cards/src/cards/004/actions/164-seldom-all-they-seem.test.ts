// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { seldomAllTheySeem } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Seldom All They Seem", () => {
//   It.skip("_(A character with cost 2 or more can {E} to sing this song for free.)_Chosen character gets -3 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: seldomAllTheySeem.cost,
//       Hand: [seldomAllTheySeem],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       SeldomAllTheySeem.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
