// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mauiWhale } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maui - Whale", () => {
//   It.skip("**THIS MISSION IS CURSED** This character doesn’t ready at the start of the turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mauiWhale.cost,
//       Play: [mauiWhale],
//     });
//
//     Const cardUnderTest = testStore.getCard(mauiWhale);
//     Expect(cardUnderTest.ready).toBe(true);
//     CardUnderTest.updateCardMeta({ exerted: true });
//     Expect(cardUnderTest.ready).toBe(false);
//     TestStore.passTurn();
//     Expect(cardUnderTest.ready).toBe(false);
//     TestStore.passTurn();
//     Expect(cardUnderTest.ready).toBe(false);
//   });
//   It.skip("**DON’T WORRY, I’M HERE** 2 {I} - Ready this character, this character can’t quest for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mauiWhale.cost,
//       Play: [mauiWhale],
//     });
//
//     Const cardUnderTest = testStore.getCard(mauiWhale);
//     CardUnderTest.updateCardMeta({ exerted: true });
//     Expect(cardUnderTest.ready).toBe(false);
//
//     CardUnderTest.activate();
//     Expect(cardUnderTest.ready).toBe(true);
//     Expect(cardUnderTest.canQuest).toBe(false);
//   });
// });
//
