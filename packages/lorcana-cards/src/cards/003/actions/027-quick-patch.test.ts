// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { quickPatch } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Quick Patch", () => {
//   it.skip("Remove up to 3 damage from chosen location.", () => {
//     const testStore = new TestStore({
//       inkwell: quickPatch.cost,
//       hand: [quickPatch],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", quickPatch.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
