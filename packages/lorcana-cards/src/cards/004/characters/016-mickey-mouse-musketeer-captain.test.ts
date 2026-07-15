// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseMusketeerCaptain } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Musketeer Captain", () => {
//   It.skip("**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)_**Bodyguard**, **Support****MUSKETEERS UNITED** When you play this character, if you used **Shift** to play him, you may draw a chard for each character with **Bodyguard** you have in play.", () => {
//     Const testStore = new TestStore({
//       Play: [mickeyMouseMusketeerCaptain],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MickeyMouseMusketeerCaptain.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
