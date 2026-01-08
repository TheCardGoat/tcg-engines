// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { shieldOfArendelle } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Shield of Arendelle", () => {
//   it.skip("**DEFLECT** Banish this item – Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
//     const testStore = new TestStore({
//       inkwell: shieldOfArendelle.cost,
//       play: [shieldOfArendelle],
//     });
//
//     const cardUnderTest = testStore.getCard(shieldOfArendelle);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
