// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { everAsBefore } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ever as Before", () => {
//   It.skip("_(A character with cost 2 or more can {E} to sing this song for free.)_<br/>Remove up to 2 damage from any number of chosen characters.", () => {
//     Const testStore = new TestStore({
//       Inkwell: everAsBefore.cost,
//       Hand: [everAsBefore],
//     });
//
//     Const cardUnderTest = testStore.getCard(everAsBefore);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
