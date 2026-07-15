// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { robinHoodArcheryContestant } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Robin Hood - Archery Contestant", () => {
//   It.skip("**TRICK SHOT** When you play this character, if an opponent has a damaged character in play, gain 1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: robinHoodArcheryContestant.cost,
//       Hand: [robinHoodArcheryContestant],
//     });
//
//     Const cardUnderTest = testStore.getCard(robinHoodArcheryContestant);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
