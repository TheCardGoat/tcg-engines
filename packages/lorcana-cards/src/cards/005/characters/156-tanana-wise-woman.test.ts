// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MonstroWhaleOfAWhale,
//   TananaWiseWoman,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tanana - Wise Woman", () => {
//   It("**YOUR BROTHERS NEED GUIDANCE** When you play this character, you may remove up to 1 damage from chosen character or location.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: tananaWiseWoman.cost,
//         Hand: [tananaWiseWoman],
//       },
//       {
//         Play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(tananaWiseWoman);
//     Const monstro = testStore.getCard(monstroWhaleOfAWhale);
//     Monstro.updateCardDamage(1);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [monstro] });
//
//     Expect(monstro.damage).toBe(0);
//   });
// });
//
