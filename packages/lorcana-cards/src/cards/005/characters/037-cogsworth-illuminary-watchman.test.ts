// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { cogsworthIlluminaryWatchman } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cogsworth - Illuminary Watchman", () => {
//   It.skip("**TIME TO MOVE IT!** When you play this character, chosen character gains **Rush** this turn. _(They can challenge the turn they’re played.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: cogsworthIlluminaryWatchman.cost,
//       Hand: [cogsworthIlluminaryWatchman],
//     });
//
//     Const cardUnderTest = testStore.getCard(cogsworthIlluminaryWatchman);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
