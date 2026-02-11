// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pegasusGiftForHercules } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pegasus - Gift for Hercules", () => {
//   It.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore({
//       Play: [pegasusGiftForHercules],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PegasusGiftForHercules.id,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
