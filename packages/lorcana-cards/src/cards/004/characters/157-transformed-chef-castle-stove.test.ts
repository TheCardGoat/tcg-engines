// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { transformedChefCastleStove } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Transformed Chef - Castle Stove", () => {
//   It.skip("**SMOOTH SMALL DISHES** When you play this character, remove up to 2 damage from chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: transformedChefCastleStove.cost,
//       Hand: [transformedChefCastleStove],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       TransformedChefCastleStove.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
