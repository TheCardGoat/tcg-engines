// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jaqConnoisseurOfClimbing } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jaq - Connoisseur of Climbing", () => {
//   It.skip("**SNEAKY IDEA** When you play this character, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: jaqConnoisseurOfClimbing.cost,
//       Hand: [jaqConnoisseurOfClimbing],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       JaqConnoisseurOfClimbing.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
