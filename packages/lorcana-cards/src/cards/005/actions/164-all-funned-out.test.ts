// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { allFunnedOut } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("All Funned Out", () => {
//   it.skip("Put chosen character of yours into your inkwell facedown and exerted.", () => {
//     const testStore = new TestStore({
//       inkwell: allFunnedOut.cost,
//       hand: [allFunnedOut],
//     });
//
//     const cardUnderTest = testStore.getCard(allFunnedOut);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
