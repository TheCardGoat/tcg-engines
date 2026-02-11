// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { healingDecanterItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Healing Decanter - Item", () => {
//   It.skip("**RENEWING ESSENCE** {E} – Remove up to 2 damage from chosen character.", () => {
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
