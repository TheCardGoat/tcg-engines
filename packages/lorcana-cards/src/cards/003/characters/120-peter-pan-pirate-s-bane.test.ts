// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { peterPanPiratesBane } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Peter Pan - Pirate’s Bane", () => {
//   It.skip("**Shift** 4 _(You may pay 4 ink to play this on top of one of your characters named Peter Pan.)_**Evasive** _(Only characters with Evasive can challenge this character.)_**YOU’RE NEXT!** Whenever he challenges a Pirate character, this character takes no damage from the challenge.", () => {
//     Const testStore = new TestStore({
//       Play: [peterPanPiratesBane],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PeterPanPiratesBane.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
