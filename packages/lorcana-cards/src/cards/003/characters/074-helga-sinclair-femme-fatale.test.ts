// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { helgaSinclairFemmeFatale } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Helga Sinclair - Femme Fatale", () => {
//   It.skip("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Helga Sinclair.)_**THIS CHANGES EVERYTHING** Whenever this character quests, you may deal 3 damage to chosen damaged character.", () => {
//     Const testStore = new TestStore({
//       Play: [helgaSinclairFemmeFatale],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HelgaSinclairFemmeFatale.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
