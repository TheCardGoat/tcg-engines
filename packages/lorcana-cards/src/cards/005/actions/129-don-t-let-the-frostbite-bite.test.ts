// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { dontLetTheFrostbiteBite } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Don't Let the Frostbite Bite", () => {
//   it.skip("_(A character with cost 7 or more can  {E} to sing this song for free.)_", () => {
//     const testStore = new TestStore({
//       inkwell: dontLetTheFrostbiteBite.cost,
//       hand: [dontLetTheFrostbiteBite],
//     });
//
//     const cardUnderTest = testStore.getCard(dontLetTheFrostbiteBite);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
//
//   it.skip("Ready all your characters. They can’t quest for the rest of this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: dontLetTheFrostbiteBite.cost,
//       hand: [dontLetTheFrostbiteBite],
//     });
//
//     const cardUnderTest = testStore.getCard(dontLetTheFrostbiteBite);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
