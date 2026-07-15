// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { nalaFierceFriend } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lucky Dime", () => {
//   It("**NUMBER ONE** {E}, 2 {I} − Choose a character of yours and gain lore equal to their {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 2,
//       Play: [luckyDime, nalaFierceFriend],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", luckyDime.id);
//     Const target = testStore.getByZoneAndId("play", nalaFierceFriend.id);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(cardUnderTest.meta.exerted).toBe(true);
//     Expect(testStore.getPlayerLore()).toBe(target.lore);
//   });
// });
//
