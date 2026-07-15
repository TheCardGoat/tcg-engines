// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { peterPanNeverLandHero } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Peter Pan - Never Land Hero", () => {
//   It.skip("**Rush** _(This character can challenge the turn they're played.)_**OVER HERE, TINK** While you have a character named Tinker Bell in play, this character gets +2 {S}.", () => {
//     Const testStore = new TestStore({
//       Play: [peterPanNeverLandHero],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PeterPanNeverLandHero.id,
//     );
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
