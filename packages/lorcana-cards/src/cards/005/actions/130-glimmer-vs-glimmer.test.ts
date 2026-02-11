// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { glimmerVsGlimmer } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Glimmer VS Glimmer", () => {
//   It.skip("Banish chosen character of yours to banish chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: glimmerVsGlimmer.cost,
//       Hand: [glimmerVsGlimmer],
//     });
//
//     Const cardUnderTest = testStore.getCard(glimmerVsGlimmer);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
