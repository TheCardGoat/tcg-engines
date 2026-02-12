// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hueySavvyNephew } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Huey - Savvy Nephew", () => {
//   It.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_**THREE NEPHEWS** Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.", () => {
//     Const testStore = new TestStore({
//       Play: [hueySavvyNephew],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", hueySavvyNephew.id);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
