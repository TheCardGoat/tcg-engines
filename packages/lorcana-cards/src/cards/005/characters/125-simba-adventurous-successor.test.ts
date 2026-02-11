// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { simbaAdventurousSuccessor } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Simba - Adventurous Successor", () => {
//   It.skip("**I LAUGH IN THE FACE OF DANGER** When you play this character, chosen character gets +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: simbaAdventurousSuccessor.cost,
//       Hand: [simbaAdventurousSuccessor],
//     });
//
//     Const cardUnderTest = testStore.getCard(simbaAdventurousSuccessor);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
