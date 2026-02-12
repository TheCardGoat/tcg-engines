// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { captainAmeliaFirstInCommand } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Captain Amelia - First in Command", () => {
//   It.skip("**DISCIPLINE** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: captainAmeliaFirstInCommand.cost,
//       Play: [captainAmeliaFirstInCommand],
//     });
//
//     Const cardUnderTest = testStore.getCard(captainAmeliaFirstInCommand);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
