// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mrsPottsEnchantedTeapot } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mrs. Potts - Enchanted Teapot", () => {
//   It.skip("**IT'LL TURN OUT ALL RIGHT** When you play this characters, if you have a character named Lumiere or Cogsworth in play, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mrsPottsEnchantedTeapot.cost,
//       Hand: [mrsPottsEnchantedTeapot],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MrsPottsEnchantedTeapot.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
