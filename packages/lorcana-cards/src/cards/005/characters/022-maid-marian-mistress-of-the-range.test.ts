// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MaidMarianLadyOfTheLists,
//   MonstroWhaleOfAWhale,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maid Marian - Lady of the Lists", () => {
//   It("**IF IT PLEASES HTE LADY** When you play this character, opposing character of your choice gets -5 {S} until the start of your next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: maidMarianLadyOfTheLists.cost,
//         Hand: [maidMarianLadyOfTheLists],
//       },
//       {
//         Play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(maidMarianLadyOfTheLists);
//     Const target = testStore.getCard(monstroWhaleOfAWhale);
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toEqual(monstroWhaleOfAWhale.strength - 5);
//   });
// });
//
