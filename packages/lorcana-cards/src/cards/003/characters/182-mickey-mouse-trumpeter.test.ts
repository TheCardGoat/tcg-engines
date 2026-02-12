// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mickeyMouseTrumpeter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Trumpeter", () => {
//   It.skip("**BUGLE CALL** {E}, 2 {I} - Play a character for free.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mickeyMouseTrumpeter.cost,
//       Play: [mickeyMouseTrumpeter],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MickeyMouseTrumpeter.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
