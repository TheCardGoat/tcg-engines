// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { jetsamUrsulasBaby } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jetsam - Ursula's Baby", () => {
//   It.skip("**Challenger** +2 _(While challenging, this character gets +2 {S}.)_**OMINOUS PAIR** Your characters named Flotsam gain **Challenger** +2.", () => {
//     Const testStore = new TestStore({
//       Play: [jetsamUrsulasBaby],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       JetsamUrsulasBaby.id,
//     );
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
