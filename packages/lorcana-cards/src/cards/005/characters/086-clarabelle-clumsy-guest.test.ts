// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { clarabelleClumsyGuest } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Clarabelle - Clumsy Guest", () => {
//   It.skip("**BUTTERFINGER** When you play this character, you may pay to {I} to banish chosen item.", () => {
//     Const testStore = new TestStore({
//       Inkwell: clarabelleClumsyGuest.cost,
//       Hand: [clarabelleClumsyGuest],
//     });
//
//     Const cardUnderTest = testStore.getCard(clarabelleClumsyGuest);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
