// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { transformedChefCastleStove } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Transformed Chef - Castle Stove", () => {
//   it.skip("**SMOOTH SMALL DISHES** When you play this character, remove up to 2 damage from chosen character.", () => {
//     const testStore = new TestStore({
//       inkwell: transformedChefCastleStove.cost,
//       hand: [transformedChefCastleStove],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       transformedChefCastleStove.id,
//     );
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
