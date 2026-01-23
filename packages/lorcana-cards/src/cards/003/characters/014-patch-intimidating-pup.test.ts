// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { patchIntimidatingPup } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Patch - Little Menace", () => {
//   it.skip("**BARK** {E} – Chosen character gets -2 {S} until the start of your next turn.", () => {
//     const testStore = new TestStore({
//       inkwell: patchIntimidatingPup.cost,
//       play: [patchIntimidatingPup],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       patchIntimidatingPup.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
