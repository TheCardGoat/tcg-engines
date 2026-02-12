// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { allFunnedOut } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("All Funned Out", () => {
//   It.skip("Put chosen character of yours into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: allFunnedOut.cost,
//       Hand: [allFunnedOut],
//     });
//
//     Const cardUnderTest = testStore.getCard(allFunnedOut);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
