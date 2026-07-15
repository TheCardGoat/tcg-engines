// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { firstAid } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("First Aid", () => {
//   It.skip("Remove up to 1 damage from each of your characters.", () => {
//     Const testStore = new TestStore({
//       Inkwell: firstAid.cost,
//       Hand: [firstAid],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", firstAid.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
