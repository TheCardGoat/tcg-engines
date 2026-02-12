// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { marshmallowTerrifyingSnowman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Marshmallow - Terrifying Snowman", () => {
//   It.skip("**BEHEMOTH** This character gets +1 {S} for each card in your hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: marshmallowTerrifyingSnowman.cost,
//       Play: [marshmallowTerrifyingSnowman],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MarshmallowTerrifyingSnowman.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
