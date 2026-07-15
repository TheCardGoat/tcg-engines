// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { kodaTalkativeCub } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Koda - Talkative Cub", () => {
//   It.skip("**TELL EVERYBODY** During opponents’ turns, you can’t lose lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: kodaTalkativeCub.cost,
//       Play: [kodaTalkativeCub],
//     });
//
//     Const cardUnderTest = testStore.getCard(kodaTalkativeCub);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
