// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { youreWelcome } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("You're Welcome", () => {
//   Describe("Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.", () => {
//     It("Shuffling your own", async () => {
//       Const testStore = new TestEngine(
//         {
//           Inkwell: youreWelcome.cost,
//           Hand: [youreWelcome],
//           Play: [forbiddenMountainMaleficentsCastle, dingleHopper],
//           Deck: 4,
//         },
//         {
//           Deck: 3,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCardModel(youreWelcome);
//       Const target = testStore.getCardModel(forbiddenMountainMaleficentsCastle);
//
//       Await testStore.playCard(cardUnderTest);
//       Await testStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).not.toBe("play");
//       Expect(testStore.getZonesCardCount("player_one").deck).toBe(3);
//       Expect(testStore.getZonesCardCount("player_one").hand).toBe(2);
//
//       Expect(testStore.getZonesCardCount("player_two").hand).toBe(0);
//       Expect(testStore.getZonesCardCount("player_two").deck).toBe(3);
//     });
//
//     It("Shuffling opponent's cards", async () => {
//       Const testStore = new TestEngine(
//         {
//           Inkwell: youreWelcome.cost,
//           Hand: [youreWelcome],
//           Deck: 4,
//         },
//         {
//           Play: [dingleHopper, forbiddenMountainMaleficentsCastle],
//           Deck: 3,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCardModel(youreWelcome);
//       Const target = testStore.getCardModel(dingleHopper);
//
//       Await testStore.playCard(cardUnderTest);
//       Await testStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).not.toBe("play");
//       Expect(testStore.getZonesCardCount("player_two").hand).toBe(2);
//       Expect(testStore.getZonesCardCount("player_two").deck).toBe(2);
//
//       Expect(testStore.getZonesCardCount("player_one").deck).toBe(4);
//       Expect(testStore.getZonesCardCount("player_one").hand).toBe(0);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Shuffles before drawing", async () => {
//     Const testStore = new TestEngine(
//       {
//         Inkwell: youreWelcome.cost,
//         Hand: [youreWelcome],
//         Play: [forbiddenMountainMaleficentsCastle],
//         Deck: 4,
//       },
//       {
//         Deck: 3,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCardModel(youreWelcome);
//     Const target = testStore.getCardModel(forbiddenMountainMaleficentsCastle);
//
//     Await testStore.playCard(cardUnderTest);
//     Await testStore.resolveTopOfStack({ targets: [target] });
//   });
// });
//
