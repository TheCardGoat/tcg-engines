// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   QuickPatch,
//   StrikeAGoodMatch,
// } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Strike a Good Match", () => {
//   It("Draw 2 cards, then choose and discard a card.", async () => {
//     Const testStore = new TestEngine({
//       Inkwell: strikeAGoodMatch.cost,
//       Hand: [strikeAGoodMatch],
//       Deck: [mickeyBraveLittleTailor, quickPatch],
//       Discard: [],
//     });
//
//     Await testStore.playCard(strikeAGoodMatch, {
//       Targets: [mickeyBraveLittleTailor],
//     });
//
//     Expect(testStore.getZonesCardCount().discard).toBe(2);
//     Expect(testStore.getZonesCardCount().hand).toBe(1);
//     Expect(testStore.getZonesCardCount().deck).toBe(0);
//     Expect(testStore.getCardModel(mickeyBraveLittleTailor).zone).toBe(
//       "discard",
//     );
//   });
// });
//
