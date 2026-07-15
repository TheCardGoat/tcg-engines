// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { kingOfHeartsMonarchOfWonderland } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("King of Hearts - Monarch of Wonderland", () => {
//   It.skip("**PLEASING THE QUEEN** {E} – Chosen exerted character can’t ready at the start of their next turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: kingOfHeartsMonarchOfWonderland.cost,
//       Play: [kingOfHeartsMonarchOfWonderland],
//     });
//
//     Const cardUnderTest = testStore.getCard(kingOfHeartsMonarchOfWonderland);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
