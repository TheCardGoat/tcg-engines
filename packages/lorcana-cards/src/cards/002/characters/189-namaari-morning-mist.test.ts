// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   NamaariMorningMist,
//   RobinHoodCapableFighter,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Namaari- Morning Mist", () => {
//   It("Bodyguard", () => {
//     Const testStore = new TestStore({
//       Hand: [namaariMorningMist],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       NamaariMorningMist.id,
//     );
//
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It("**BLADES** This character can challenge ready characters.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [namaariMorningMist],
//       },
//       { play: [robinHoodCapableFighter] },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       NamaariMorningMist.id,
//     );
//     Const defender = testStore.getByZoneAndId(
//       "play",
//       RobinHoodCapableFighter.id,
//       "player_two",
//     );
//
//     Expect(cardUnderTest.canChallenge(defender)).toBe(true);
//
//     CardUnderTest.challenge(defender);
//
//     Expect(cardUnderTest.ready).toBe(false);
//     Expect(cardUnderTest.meta.damage).toBe(defender.strength);
//   });
// });
//
