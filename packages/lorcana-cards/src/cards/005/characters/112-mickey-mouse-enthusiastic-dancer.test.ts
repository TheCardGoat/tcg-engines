// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mickeyMouseEnthusiasticDancer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Enthusiastic Dancer", () => {
//   It.skip("**PERFECT PARTNERS** While you have a character named Minnie Mouse in play, this character gets +2 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mickeyMouseEnthusiasticDancer.cost,
//       Play: [mickeyMouseEnthusiasticDancer],
//     });
//
//     Const cardUnderTest = testStore.getCard(mickeyMouseEnthusiasticDancer);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
