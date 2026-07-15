// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { flounderCollectorsCompanion } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Flounder - Collector's Companion", () => {
//   It.skip("**Support** _(Whenever this character quests, you mad add their {S} to another chosen character's {S} this turn.)_**I'M NOT A GUPPY** If you have a character named Ariel in play, you pay 1 {I} less to play this character.", () => {
//     Const testStore = new TestStore({
//       Play: [flounderCollectorsCompanion],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       FlounderCollectorsCompanion.id,
//     );
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
