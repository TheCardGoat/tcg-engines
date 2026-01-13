// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { maidMarianLadyOfTheLists } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Maid Marian - Lady of the Lists", () => {
//   it.skip("IF THE LADY WANTS IT", () => {
//     const testStore = new TestStore({
//       inkwell: maidMarianLadyOfTheLists.cost,
//       play: [maidMarianLadyOfTheLists],
//     });
//
//     const cardUnderTest = testStore.getCard(maidMarianLadyOfTheLists);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
