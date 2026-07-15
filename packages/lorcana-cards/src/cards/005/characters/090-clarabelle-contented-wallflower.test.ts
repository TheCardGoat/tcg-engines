// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { clarabelleContentedWallflower } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Clarabelle - Contented Wallflower", () => {
//   It.skip("**ONE STEP BEHIND** When you play this character, if an opponent has more cards in their hand than you, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: clarabelleContentedWallflower.cost,
//       Hand: [clarabelleContentedWallflower],
//     });
//
//     Const cardUnderTest = testStore.getCard(clarabelleContentedWallflower);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
