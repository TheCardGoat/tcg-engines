// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { littleJohnResourcefulOutlaw } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Little John - Resourceful Outlaw", () => {
//   It.skip("**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Little John.)_**OKAY, BIG SHOT** While this character is exerted, your characters with **Bodyguard** gain **Resist** +1 and get +1 {L}. _(Damage dealt to them is reduced by 1.)_", () => {
//     Const testStore = new TestStore({
//       Play: [littleJohnResourcefulOutlaw],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       LittleJohnResourcefulOutlaw.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
