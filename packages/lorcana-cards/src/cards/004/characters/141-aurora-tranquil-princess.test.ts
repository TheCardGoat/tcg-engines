// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { auroraTranquilPrincess } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Aurora - Tranquil Princess", () => {
//   It.skip("**Ward** _(Opponents can't choose this character except to challenge.)_", () => {
//     Const testStore = new TestStore({
//       Play: [auroraTranquilPrincess],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       AuroraTranquilPrincess.id,
//     );
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
