// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { robinHoodSneakySleuth } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Robin Hood - Sneaky Sleuth", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: robinHoodSneakySleuth.cost,
//       Play: [robinHoodSneakySleuth],
//     });
//
//     Const cardUnderTest = testStore.getCard(robinHoodSneakySleuth);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("**CLEVER PLAN** This character gets +1 {L} for each opposing damaged character in play._ **", () => {
//     Const testStore = new TestStore({
//       Inkwell: robinHoodSneakySleuth.cost,
//       Play: [robinHoodSneakySleuth],
//     });
//
//     Const cardUnderTest = testStore.getCard(robinHoodSneakySleuth);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
