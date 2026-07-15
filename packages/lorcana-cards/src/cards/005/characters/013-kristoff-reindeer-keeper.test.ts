// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { aWholeNewWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { aladdinResoluteSwordsman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   KristoffReindeerKeeper,
//   PeteGamesReferee,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kristoff - Reindeer Keeper", () => {
//   Describe("**SONG OF THE HERD** For each song card in your discard, you pay 1 {I} less to play this character.", () => {
//     It("Should pay 'N' less 'n' being the number os songs on discard", () => {
//       Const testStore = new TestStore({
//         Inkwell: kristoffReindeerKeeper.cost,
//         Hand: [kristoffReindeerKeeper],
//         Discard: [aWholeNewWorld, aWholeNewWorld, aWholeNewWorld],
//       });
//
//       Const cardUnderTest = testStore.getCard(kristoffReindeerKeeper);
//
//       CardUnderTest.playFromHand({ bodyguard: false });
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(testStore.getAvailableInkwellCardCount()).toEqual(
//         KristoffReindeerKeeper.cost -
//           (kristoffReindeerKeeper.cost - testStore.getZonesCardCount().discard),
//       );
//     });
//
//     It("Should pay full cost if no song is on the discard", () => {
//       Const testStore = new TestStore({
//         Inkwell: kristoffReindeerKeeper.cost,
//         Hand: [kristoffReindeerKeeper],
//         Discard: [
//           AladdinResoluteSwordsman,
//           AladdinResoluteSwordsman,
//           AladdinResoluteSwordsman,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getCard(kristoffReindeerKeeper);
//
//       CardUnderTest.playFromHand({ bodyguard: false });
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(testStore.getAvailableInkwellCardCount()).toEqual(0);
//     });
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Does NOT reduce cost of the next card played", () => {
//     Const testStore = new TestStore({
//       Inkwell: kristoffReindeerKeeper.cost - 3 + peteGamesReferee.cost,
//       Hand: [kristoffReindeerKeeper, peteGamesReferee],
//       Discard: [aWholeNewWorld, aWholeNewWorld, aWholeNewWorld],
//     });
//
//     Const cardUnderTest = testStore.getCard(kristoffReindeerKeeper);
//     Const anotherCardUnderTest = testStore.getCard(peteGamesReferee);
//
//     CardUnderTest.playFromHand({ bodyguard: false });
//     Expect(cardUnderTest.zone).toEqual("play");
//
//     AnotherCardUnderTest.playFromHand();
//     Expect(anotherCardUnderTest.zone).toEqual("play");
//
//     Expect(testStore.getAvailableInkwellCardCount()).toEqual(0);
//   });
// });
//
