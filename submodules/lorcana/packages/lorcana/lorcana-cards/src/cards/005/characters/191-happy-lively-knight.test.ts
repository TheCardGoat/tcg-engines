// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { happyLivelyKnight } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Happy - Lively Knight", () => {
//   It.skip("**BURST OF SPEED** During your turn, this character gains Evasive. _(They can challenge characters with Evasive.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: happyLivelyKnight.cost,
//       Play: [happyLivelyKnight],
//     });
//
//     Const cardUnderTest = testStore.getCard(happyLivelyKnight);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
