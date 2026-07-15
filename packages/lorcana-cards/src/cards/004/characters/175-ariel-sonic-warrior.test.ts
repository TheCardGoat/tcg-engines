// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielSonicWarrior } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ariel - Sonic Warrior", () => {
//   It.skip("**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Ariel.)_", () => {
//     Const testStore = new TestStore({
//       Play: [arielSonicWarrior],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ArielSonicWarrior.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("**AMPLIFIED VOICE** Whenever you play a song, you may pay {I} to deal 3 daamge to chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: arielSonicWarrior.cost,
//       Play: [arielSonicWarrior],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ArielSonicWarrior.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
