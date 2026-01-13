// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { healingDecanterItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Healing Decanter - Item", () => {
//   it.skip("**RENEWING ESSENCE** {E} – Remove up to 2 damage from chosen character.", () => {
//     const testStore = new TestStore({
//       inkwell: healingDecanterItem.cost,
//       play: [healingDecanterItem],
//     });
//
//     const cardUnderTest = testStore.getCard(healingDecanterItem);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
