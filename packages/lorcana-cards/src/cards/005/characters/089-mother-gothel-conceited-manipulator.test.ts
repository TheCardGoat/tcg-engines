// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MonstroWhaleOfAWhale,
//   MotherGothelConceitedManipulator,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mother Gothel - Conceited Manipulator", () => {
//   It("**MOTHER KNOWS BEST** When you play this character, you may pay 3 {I} to return chosen character to their player’s hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: motherGothelConceitedManipulator.cost + 3,
//       Hand: [motherGothelConceitedManipulator],
//       Play: [monstroWhaleOfAWhale],
//     });
//
//     Const cardUnderTest = testStore.getCard(motherGothelConceitedManipulator);
//     Const target = testStore.getCard(monstroWhaleOfAWhale);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.zone).toEqual("hand");
//   });
// });
//
