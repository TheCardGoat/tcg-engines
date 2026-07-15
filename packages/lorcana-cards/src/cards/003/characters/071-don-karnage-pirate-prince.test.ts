// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donKarnagePiratePrince } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Don Karnage - Pirate Prince", () => {
//   It.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore({
//       Play: [donKarnagePiratePrince],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DonKarnagePiratePrince.id,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
