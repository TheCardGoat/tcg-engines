// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { belleUntrainedMystic } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Belle - Untrained Mystic", () => {
//   It.skip("**HERE NOW, DON'T DO THAT** When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: belleUntrainedMystic.cost,
//       Hand: [belleUntrainedMystic],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       BelleUntrainedMystic.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
