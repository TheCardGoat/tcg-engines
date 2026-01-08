// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { razoulPalaceGuard } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Razoul - Palace Guard", () => {
//   it.skip("**LOOKY HERE** While this character has no damage, he gets +2 {S}.", () => {
//     const testStore = new TestStore({
//       inkwell: razoulPalaceGuard.cost,
//       play: [razoulPalaceGuard],
//     });
//
//     const cardUnderTest = testStore.getCard(razoulPalaceGuard);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
