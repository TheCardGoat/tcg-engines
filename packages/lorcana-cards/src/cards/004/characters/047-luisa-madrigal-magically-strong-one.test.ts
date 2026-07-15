// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { luisaMadrigalMagicallyStrongOne } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Luisa Madrigal - Magically Strong One", () => {
//   It.skip("**Rush** _(This character can challenge the turn they're played.)_", () => {
//     Const testStore = new TestStore({
//       Play: [luisaMadrigalMagicallyStrongOne],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       LuisaMadrigalMagicallyStrongOne.id,
//     );
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
