// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { hadesWrathfulRuler } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Hades - Wrathful Ruler", () => {
//   it.skip("**CALLING THE TITANS** {E} – Ready your Titan characters.", () => {
//     const testStore = new TestStore({
//       inkwell: hadesWrathfulRuler.cost,
//       play: [hadesWrathfulRuler],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       hadesWrathfulRuler.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
