// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { heartOfTeFiti } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Heart of Te Fiti", () => {
//   It.skip("**CREATE LIFE** {E}, 2 {I} – Put the top card of your deck into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: heartOfTeFiti.cost,
//       Play: [heartOfTeFiti],
//     });
//
//     Const cardUnderTest = testStore.getCard(heartOfTeFiti);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
