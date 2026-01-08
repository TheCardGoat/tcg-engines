// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { everAsBefore } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ever as Before", () => {
//   it.skip("_(A character with cost 2 or more can {E} to sing this song for free.)_<br/>Remove up to 2 damage from any number of chosen characters.", () => {
//     const testStore = new TestStore({
//       inkwell: everAsBefore.cost,
//       hand: [everAsBefore],
//     });
//
//     const cardUnderTest = testStore.getCard(everAsBefore);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
