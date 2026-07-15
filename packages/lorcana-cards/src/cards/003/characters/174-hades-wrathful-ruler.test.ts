// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { hadesWrathfulRuler } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hades - Wrathful Ruler", () => {
//   It.skip("**CALLING THE TITANS** {E} – Ready your Titan characters.", () => {
//     Const testStore = new TestStore({
//       Inkwell: hadesWrathfulRuler.cost,
//       Play: [hadesWrathfulRuler],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HadesWrathfulRuler.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
