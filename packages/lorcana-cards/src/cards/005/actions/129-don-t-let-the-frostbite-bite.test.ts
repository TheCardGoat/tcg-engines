// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { dontLetTheFrostbiteBite } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Don't Let the Frostbite Bite", () => {
//   It.skip("_(A character with cost 7 or more can  {E} to sing this song for free.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: dontLetTheFrostbiteBite.cost,
//       Hand: [dontLetTheFrostbiteBite],
//     });
//
//     Const cardUnderTest = testStore.getCard(dontLetTheFrostbiteBite);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("Ready all your characters. They can’t quest for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: dontLetTheFrostbiteBite.cost,
//       Hand: [dontLetTheFrostbiteBite],
//     });
//
//     Const cardUnderTest = testStore.getCard(dontLetTheFrostbiteBite);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
