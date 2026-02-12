// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BibbidiBobbidiBoo,
//   Hypnotize,
// } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hypnotize", () => {
//   It("Each opponent chooses and discards a card. Draw a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Deck: 2,
//         Inkwell: hypnotize.cost,
//         Hand: [hypnotize],
//       },
//       {
//         Deck: 2,
//         Hand: [bibbidiBobbidiBoo],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", hypnotize.id);
//     Const target = testStore.getByZoneAndId(
//       "hand",
//       BibbidiBobbidiBoo.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({}, true);
//
//     TestStore.changePlayer("player_two");
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Hand: 0,
//         Deck: 2,
//         Discard: 1,
//       }),
//     );
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 1,
//       }),
//     );
//   });
//
//   It("Opponent no cards in hand, should still draw", () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 2,
//         Inkwell: hypnotize.cost,
//         Hand: [hypnotize],
//       },
//       {
//         Deck: 2,
//         Hand: [],
//       },
//     );
//
//     TestEngine.playCard(hypnotize);
//     TestEngine.resolveTopOfStack({});
//
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Hand: 0,
//         Deck: 2,
//         Discard: 0,
//       }),
//     );
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 1,
//       }),
//     );
//   });
// });
//
