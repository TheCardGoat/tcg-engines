// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { shenziScarsAccomplice } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Shenzi - Scar's Accomplice", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: shenziScarsAccomplice.cost,
//       play: [shenziScarsAccomplice],
//     });
//
//     const cardUnderTest = testStore.getCard(shenziScarsAccomplice);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
//
//   it.skip("**EASY PICKINGS** While challenging a damaged character, this character gets +2 {S}.", () => {
//     const testStore = new TestStore({
//       inkwell: shenziScarsAccomplice.cost,
//       play: [shenziScarsAccomplice],
//     });
//
//     const cardUnderTest = testStore.getCard(shenziScarsAccomplice);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
