// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { repair } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Repair", () => {
//   it.skip("Remove up to 3 damage from one of your locations or characters.", () => {
//     const testStore = new TestStore({
//       inkwell: repair.cost,
//       hand: [repair],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", repair.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
