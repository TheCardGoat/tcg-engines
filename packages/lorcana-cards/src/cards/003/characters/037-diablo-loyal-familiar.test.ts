// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { diabloLoyalFamiliar } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Diablo - Loyal Familiar", () => {
//   It.skip("**IN SEARCH OF AURORA** Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: diabloLoyalFamiliar.cost,
//       Play: [diabloLoyalFamiliar],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DiabloLoyalFamiliar.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
