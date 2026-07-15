// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { sneezyNoisyKnight } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sneezy - Noisy Knight", () => {
//   It.skip("**HEADWIND** When you play this character, chosen Knight character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: sneezyNoisyKnight.cost,
//       Hand: [sneezyNoisyKnight],
//     });
//
//     Const cardUnderTest = testStore.getCard(sneezyNoisyKnight);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
