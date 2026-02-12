// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { healingDecanterItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Healing Decanter", () => {
//   It.skip("RENEWING ESSENCE", () => {
//     Const testStore = new TestStore({
//       Inkwell: healingDecanterItem.cost,
//       Play: [healingDecanterItem],
//     });
//
//     Const cardUnderTest = testStore.getCard(healingDecanterItem);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
