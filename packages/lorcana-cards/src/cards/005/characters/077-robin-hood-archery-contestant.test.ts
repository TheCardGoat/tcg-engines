// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { robinHoodArcheryContestant } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Robin Hood - Archery Contestant", () => {
//   it.skip("**TRICK SHOT** When you play this character, if an opponent has a damaged character in play, gain 1 lore.", () => {
//     const testStore = new TestStore({
//       inkwell: robinHoodArcheryContestant.cost,
//       hand: [robinHoodArcheryContestant],
//     });
//
//     const cardUnderTest = testStore.getCard(robinHoodArcheryContestant);
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
