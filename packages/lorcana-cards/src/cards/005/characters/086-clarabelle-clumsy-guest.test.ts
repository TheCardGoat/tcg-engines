// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { clarabelleClumsyGuest } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Clarabelle - Clumsy Guest", () => {
//   it.skip("**BUTTERFINGER** When you play this character, you may pay to {I} to banish chosen item.", () => {
//     const testStore = new TestStore({
//       inkwell: clarabelleClumsyGuest.cost,
//       hand: [clarabelleClumsyGuest],
//     });
//
//     const cardUnderTest = testStore.getCard(clarabelleClumsyGuest);
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
