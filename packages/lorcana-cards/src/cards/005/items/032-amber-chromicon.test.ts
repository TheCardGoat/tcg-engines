// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { amberChromiconItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Amber Chromicon", () => {
//   It.skip("AMBER LIGHT", () => {
//     Const testStore = new TestStore({
//       Inkwell: amberChromiconItem.cost,
//       Play: [amberChromiconItem],
//     });
//
//     Const cardUnderTest = testStore.getCard(amberChromiconItem);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
