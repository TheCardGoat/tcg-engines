// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { magicBroomAerialCleaner } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Broom - Aerial Cleaner", () => {
//   It.skip("**WINGED FOR A DAY** During your turn, this character gains **Evasive.** _(They can challenge characters with Evasive.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: magicBroomAerialCleaner.cost,
//       Play: [magicBroomAerialCleaner],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MagicBroomAerialCleaner.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
