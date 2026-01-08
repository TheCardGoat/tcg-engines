// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { happyLivelyKnight } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Happy - Lively Knight", () => {
//   it.skip("**BURST OF SPEED** During your turn, this character gains Evasive. _(They can challenge characters with Evasive.)_", () => {
//     const testStore = new TestStore({
//       inkwell: happyLivelyKnight.cost,
//       play: [happyLivelyKnight],
//     });
//
//     const cardUnderTest = testStore.getCard(happyLivelyKnight);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
