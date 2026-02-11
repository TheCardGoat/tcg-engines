// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { pyrosLavaTitan } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pyros - Lava Titan", () => {
//   It.skip("**ERUPTION** During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: pyrosLavaTitan.cost,
//       Play: [pyrosLavaTitan],
//     });
//
//     Const cardUnderTest = testStore.getCard(pyrosLavaTitan);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
