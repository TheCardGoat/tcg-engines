// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { repair } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Repair", () => {
//   It.skip("Remove up to 3 damage from one of your locations or characters.", () => {
//     Const testStore = new TestStore({
//       Inkwell: repair.cost,
//       Hand: [repair],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", repair.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
