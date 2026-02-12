// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { makeThePotion } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Make the Potion", () => {
//   It.skip("Choose one:· Banish chosen item.· Deal 2 damage to chosen damaged character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: makeThePotion.cost,
//       Hand: [makeThePotion],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", makeThePotion.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
