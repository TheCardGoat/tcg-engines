// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   monstroWhaleOfAWhale,
//   motherGothelConceitedManipulator,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mother Gothel - Conceited Manipulator", () => {
//   it("**MOTHER KNOWS BEST** When you play this character, you may pay 3 {I} to return chosen character to their player’s hand.", () => {
//     const testStore = new TestStore({
//       inkwell: motherGothelConceitedManipulator.cost + 3,
//       hand: [motherGothelConceitedManipulator],
//       play: [monstroWhaleOfAWhale],
//     });
//
//     const cardUnderTest = testStore.getCard(motherGothelConceitedManipulator);
//     const target = testStore.getCard(monstroWhaleOfAWhale);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({ targets: [target] });
//     expect(target.zone).toEqual("hand");
//   });
// });
//
