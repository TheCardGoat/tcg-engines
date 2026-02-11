// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { maidMarianLadyOfTheLists } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maid Marian - Lady of the Lists", () => {
//   It.skip("IF THE LADY WANTS IT", () => {
//     Const testStore = new TestStore({
//       Inkwell: maidMarianLadyOfTheLists.cost,
//       Play: [maidMarianLadyOfTheLists],
//     });
//
//     Const cardUnderTest = testStore.getCard(maidMarianLadyOfTheLists);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
