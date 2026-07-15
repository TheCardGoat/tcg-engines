// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { plutoDeterminedDefender } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pluto - Determined Defender", () => {
//   It.skip("**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Pluto.)_**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**GUARD DOG** At the start of your turn, remove up to 3 damage from this character.", () => {
//     Const testStore = new TestStore({
//       Play: [plutoDeterminedDefender],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PlutoDeterminedDefender.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
