// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseMusketeerCaptain } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mickey Mouse - Musketeer Captain", () => {
//   it.skip("**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)_**Bodyguard**, **Support****MUSKETEERS UNITED** When you play this character, if you used **Shift** to play him, you may draw a chard for each character with **Bodyguard** you have in play.", () => {
//     const testStore = new TestStore({
//       play: [mickeyMouseMusketeerCaptain],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       mickeyMouseMusketeerCaptain.id,
//     );
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
