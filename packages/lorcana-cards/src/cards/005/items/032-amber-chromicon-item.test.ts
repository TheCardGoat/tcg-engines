// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { amberChromiconItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Amber Chromicon - Item", () => {
//   it.skip("**AMBER LIGHT** {E} – Remove up to 1 damage from each of your characters.", () => {
//     const testStore = new TestStore({
//       inkwell: amberChromiconItem.cost,
//       play: [amberChromiconItem],
//     });
//
//     const cardUnderTest = testStore.getCard(amberChromiconItem);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
