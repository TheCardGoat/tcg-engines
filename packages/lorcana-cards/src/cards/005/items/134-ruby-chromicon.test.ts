// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rubyChromicon } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ruby Chromicon", () => {
//   It.skip("**RUBY LIGHT** {E} − Chosen character gets +1 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rubyChromicon.cost,
//       Play: [rubyChromicon],
//     });
//
//     Const cardUnderTest = testStore.getCard(rubyChromicon);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
