// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { motherGothelUnwaveringSchemer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mother Gothel - Unwavering Schemer", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: motherGothelUnwaveringSchemer.cost,
//       Play: [motherGothelUnwaveringSchemer],
//     });
//
//     Const cardUnderTest = testStore.getCard(motherGothelUnwaveringSchemer);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("**THE WORLD IS DARK** When you play this character, each opponent chooses one of their characters and returns that card to their hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: motherGothelUnwaveringSchemer.cost,
//       Hand: [motherGothelUnwaveringSchemer],
//     });
//
//     Const cardUnderTest = testStore.getCard(motherGothelUnwaveringSchemer);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
