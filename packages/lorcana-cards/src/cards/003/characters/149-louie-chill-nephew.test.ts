// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { louieChillNephew } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Louie - Chill Nephew", () => {
//   It.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
//     Const testStore = new TestStore({
//       Play: [louieChillNephew],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", louieChillNephew.id);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
