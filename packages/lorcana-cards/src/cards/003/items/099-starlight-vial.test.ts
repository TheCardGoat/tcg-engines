// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { starlightVial } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Starlight Vial", () => {
//   It.skip("**EFFICIENT ENERGY** {E} – You pay 2 {I} less for the next action you play this turn.**TRAP** 2 {I}, Banish this item – Draw 2 cards, then choose and discard a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: starlightVial.cost,
//       Play: [starlightVial],
//     });
//
//     Const cardUnderTest = testStore.getCard(starlightVial);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
