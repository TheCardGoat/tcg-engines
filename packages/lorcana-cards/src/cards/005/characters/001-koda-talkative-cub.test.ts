// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { kodaTalkativeCub } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Koda - Talkative Cub", () => {
//   it.skip("**TELL EVERYBODY** During opponents’ turns, you can’t lose lore.", () => {
//     const testStore = new TestStore({
//       inkwell: kodaTalkativeCub.cost,
//       play: [kodaTalkativeCub],
//     });
//
//     const cardUnderTest = testStore.getCard(kodaTalkativeCub);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
