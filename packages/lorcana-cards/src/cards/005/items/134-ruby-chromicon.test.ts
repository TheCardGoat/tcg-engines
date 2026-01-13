// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { rubyChromicon } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ruby Chromicon", () => {
//   it.skip("**RUBY LIGHT** {E} − Chosen character gets +1 {S} this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: rubyChromicon.cost,
//       play: [rubyChromicon],
//     });
//
//     const cardUnderTest = testStore.getCard(rubyChromicon);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
