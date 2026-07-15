// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   GoofyKnightForADay,
//   PrinceJohnGreediestOfAll,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Let the Storm Rage On", () => {
//   It("Deal 2 damage to chosen character. Draw a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: letTheStormRageOn.cost,
//         Hand: [letTheStormRageOn],
//         Deck: 2,
//       },
//       { play: [goofyKnightForADay] },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       LetTheStormRageOn.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toEqual(2);
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 1,
//         Hand: 1,
//       }),
//     );
//   });
// });
//
// Describe("Regression", () => {
//   It("Can't target characters with ward", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: letTheStormRageOn.cost,
//         Hand: [letTheStormRageOn],
//         Deck: 2,
//       },
//       { play: [princeJohnGreediestOfAll] },
//     );
//
//     Const cardUnderTest = testStore.getCard(letTheStormRageOn);
//     Const target = testStore.getCard(princeJohnGreediestOfAll);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//     Expect(target.meta.damage).toBeFalsy();
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 1,
//         Hand: 1,
//       }),
//     );
//   });
//
//   It("Should not draw before targeting", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: letTheStormRageOn.cost,
//         Hand: [letTheStormRageOn],
//         Deck: 2,
//       },
//       { play: [goofyKnightForADay] },
//     );
//
//     Await testEngine.playCard(letTheStormRageOn);
//     Expect(testEngine.stackLayers).toHaveLength(2);
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBeFalsy();
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 2,
//         Hand: 0,
//       }),
//     );
//
//     Await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] }, true);
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(2);
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 1,
//         Hand: 1,
//       }),
//     );
//   });
// });
//
