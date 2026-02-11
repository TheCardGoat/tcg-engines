// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { stitchTeamUnderdog } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Stitch - Team Underdog", () => {
//   It.skip("**HEAVE HO!** When you play this character, you may deal 2 damage to chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: stitchTeamUnderdog.cost,
//       Hand: [stitchTeamUnderdog],
//     });
//
//     Const cardUnderTest = testStore.getCard(stitchTeamUnderdog);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
