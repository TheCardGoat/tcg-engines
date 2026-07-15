// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { glean } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Glaner", () => {
//   It.skip("Choisissez un objet et bannissez-le. Son propriétaire gagne 2 éclats de Lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: glean.cost,
//       Hand: [glean],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", glean.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
