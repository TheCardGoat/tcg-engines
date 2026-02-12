// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { tritonsDecree } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Triton's Decree", () => {
//   It.skip("Each opponent chooses one of their characters and deals 2 damage to them.", () => {
//     Const testStore = new TestStore({
//       Inkwell: tritonsDecree.cost,
//       Hand: [tritonsDecree],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", tritonsDecree.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
