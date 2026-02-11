// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { quickPatch } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Quick Patch", () => {
//   It.skip("Remove up to 3 damage from chosen location.", () => {
//     Const testStore = new TestStore({
//       Inkwell: quickPatch.cost,
//       Hand: [quickPatch],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", quickPatch.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
