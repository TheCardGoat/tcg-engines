// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { mickeyMouseEnthusiasticDancer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mickey Mouse - Enthusiastic Dancer", () => {
//   it.skip("**PERFECT PARTNERS** While you have a character named Minnie Mouse in play, this character gets +2 {S}.", () => {
//     const testStore = new TestStore({
//       inkwell: mickeyMouseEnthusiasticDancer.cost,
//       play: [mickeyMouseEnthusiasticDancer],
//     });
//
//     const cardUnderTest = testStore.getCard(mickeyMouseEnthusiasticDancer);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
