// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   monstroWhaleOfAWhale,
//   tananaWiseWoman,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Tanana - Wise Woman", () => {
//   it("**YOUR BROTHERS NEED GUIDANCE** When you play this character, you may remove up to 1 damage from chosen character or location.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: tananaWiseWoman.cost,
//         hand: [tananaWiseWoman],
//       },
//       {
//         play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     const cardUnderTest = testStore.getCard(tananaWiseWoman);
//     const monstro = testStore.getCard(monstroWhaleOfAWhale);
//     monstro.updateCardDamage(1);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({ targets: [monstro] });
//
//     expect(monstro.damage).toBe(0);
//   });
// });
//
