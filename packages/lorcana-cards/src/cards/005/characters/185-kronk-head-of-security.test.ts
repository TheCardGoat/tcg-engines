// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { kronkHeadOfSecurity } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Kronk - Head of Security", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: kronkHeadOfSecurity.cost,
//       play: [kronkHeadOfSecurity],
//     });
//
//     const cardUnderTest = testStore.getCard(kronkHeadOfSecurity);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
