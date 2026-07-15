// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { amberChromiconItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Amber Chromicon - Item", () => {
//   It.skip("**AMBER LIGHT** {E} – Remove up to 1 damage from each of your characters.", () => {
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
