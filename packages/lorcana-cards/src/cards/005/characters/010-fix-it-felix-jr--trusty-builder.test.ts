// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { fixitFelixJrTrustyBuilder } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Fix‐It Felix, Jr. - Trusty Builder", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: fixitFelixJrTrustyBuilder.cost,
//       play: [fixitFelixJrTrustyBuilder],
//     });
//
//     const cardUnderTest = testStore.getCard(fixitFelixJrTrustyBuilder);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
