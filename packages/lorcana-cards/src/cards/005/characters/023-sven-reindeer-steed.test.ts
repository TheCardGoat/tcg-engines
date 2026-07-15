// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { svenReindeerSteed } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sven - Reindeer Steed", () => {
//   It.skip("**REINDEER GAMES** When you play this character, you may ready chosen character. They can’t quest or challenge for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: svenReindeerSteed.cost,
//       Hand: [svenReindeerSteed],
//     });
//
//     Const cardUnderTest = testStore.getCard(svenReindeerSteed);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
