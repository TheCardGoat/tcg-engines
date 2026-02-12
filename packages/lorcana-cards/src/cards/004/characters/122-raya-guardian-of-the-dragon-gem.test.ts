// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rayaGuardianOfTheDragonGem } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Raya - Guardian of the Dragon Gem", () => {
//   It.skip("**WE MUST JOIN FORCES** When you play this character, ready chosen character of yours at a location. They can’t quest for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rayaGuardianOfTheDragonGem.cost,
//       Hand: [rayaGuardianOfTheDragonGem],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       RayaGuardianOfTheDragonGem.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
