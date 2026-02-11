// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { patchIntimidatingPup } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Patch - Little Menace", () => {
//   It.skip("**BARK** {E} – Chosen character gets -2 {S} until the start of your next turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: patchIntimidatingPup.cost,
//       Play: [patchIntimidatingPup],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PatchIntimidatingPup.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
