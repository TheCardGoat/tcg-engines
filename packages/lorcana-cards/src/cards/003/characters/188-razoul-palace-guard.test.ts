// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { razoulPalaceGuard } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Razoul - Palace Guard", () => {
//   It.skip("**LOOKY HERE** While this character has no damage, he gets +2 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: razoulPalaceGuard.cost,
//       Play: [razoulPalaceGuard],
//     });
//
//     Const cardUnderTest = testStore.getCard(razoulPalaceGuard);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
