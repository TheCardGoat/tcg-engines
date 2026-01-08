// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { glean } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Glaner", () => {
//   it.skip("Choisissez un objet et bannissez-le. Son propriétaire gagne 2 éclats de Lore.", () => {
//     const testStore = new TestStore({
//       inkwell: glean.cost,
//       hand: [glean],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", glean.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
