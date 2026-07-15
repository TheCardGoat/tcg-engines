// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { princeJohnGoldLover } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince John - Gold Lover", () => {
//   It.skip("**BEAUTIFUL, LOVELY TAXES** {E} – Play an item from your hand or discard with cost 5 or less for free, exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: princeJohnGoldLover.cost,
//       Play: [princeJohnGoldLover],
//     });
//
//     Const cardUnderTest = testStore.getCard(princeJohnGoldLover);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
