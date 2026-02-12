// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaUndeterredVoyager } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Moana - Undeterred Voyager", () => {
//   It.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore({
//       Play: [moanaUndeterredVoyager],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MoanaUndeterredVoyager.id,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
