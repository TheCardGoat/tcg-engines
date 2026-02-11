// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { simbaLostPrince } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Simba - Lost Prince", () => {
//   It.skip("**FACE THE PAST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: simbaLostPrince.cost,
//       Play: [simbaLostPrince],
//     });
//
//     Const cardUnderTest = testStore.getCard(simbaLostPrince);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
