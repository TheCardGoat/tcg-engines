// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { princeJohnGoldLover } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Prince John - Gold Lover", () => {
//   it.skip("**BEAUTIFUL, LOVELY TAXES** {E} – Play an item from your hand or discard with cost 5 or less for free, exerted.", () => {
//     const testStore = new TestStore({
//       inkwell: princeJohnGoldLover.cost,
//       play: [princeJohnGoldLover],
//     });
//
//     const cardUnderTest = testStore.getCard(princeJohnGoldLover);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
