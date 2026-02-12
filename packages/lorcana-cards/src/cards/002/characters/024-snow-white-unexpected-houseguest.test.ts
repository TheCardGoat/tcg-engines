// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { snowWhiteUnexpectedHouseGuest } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Snow White - Unexpected Houseguest", () => {
//   It.skip("How Do You Do?", () => {
//     Const testStore = new TestStore({
//       Inkwell: snowWhiteUnexpectedHouseGuest.cost,
//       Play: [snowWhiteUnexpectedHouseGuest],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       SnowWhiteUnexpectedHouseGuest.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
