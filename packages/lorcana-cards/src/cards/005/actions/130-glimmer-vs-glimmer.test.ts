// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { glimmerVsGlimmer } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Glimmer VS Glimmer", () => {
//   it.skip("Banish chosen character of yours to banish chosen character.", () => {
//     const testStore = new TestStore({
//       inkwell: glimmerVsGlimmer.cost,
//       hand: [glimmerVsGlimmer],
//     });
//
//     const cardUnderTest = testStore.getCard(glimmerVsGlimmer);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
