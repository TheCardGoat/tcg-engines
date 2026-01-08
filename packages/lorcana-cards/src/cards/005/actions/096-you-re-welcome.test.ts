// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { youreWelcome } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("You're Welcome", () => {
//   describe("Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.", () => {
//     it("Shuffling your own", async () => {
//       const testStore = new TestEngine(
//         {
//           inkwell: youreWelcome.cost,
//           hand: [youreWelcome],
//           play: [forbiddenMountainMaleficentsCastle, dingleHopper],
//           deck: 4,
//         },
//         {
//           deck: 3,
//         },
//       );
//
//       const cardUnderTest = testStore.getCardModel(youreWelcome);
//       const target = testStore.getCardModel(forbiddenMountainMaleficentsCastle);
//
//       await testStore.playCard(cardUnderTest);
//       await testStore.resolveTopOfStack({ targets: [target] });
//
//       expect(target.zone).not.toBe("play");
//       expect(testStore.getZonesCardCount("player_one").deck).toBe(3);
//       expect(testStore.getZonesCardCount("player_one").hand).toBe(2);
//
//       expect(testStore.getZonesCardCount("player_two").hand).toBe(0);
//       expect(testStore.getZonesCardCount("player_two").deck).toBe(3);
//     });
//
//     it("Shuffling opponent's cards", async () => {
//       const testStore = new TestEngine(
//         {
//           inkwell: youreWelcome.cost,
//           hand: [youreWelcome],
//           deck: 4,
//         },
//         {
//           play: [dingleHopper, forbiddenMountainMaleficentsCastle],
//           deck: 3,
//         },
//       );
//
//       const cardUnderTest = testStore.getCardModel(youreWelcome);
//       const target = testStore.getCardModel(dingleHopper);
//
//       await testStore.playCard(cardUnderTest);
//       await testStore.resolveTopOfStack({ targets: [target] });
//
//       expect(target.zone).not.toBe("play");
//       expect(testStore.getZonesCardCount("player_two").hand).toBe(2);
//       expect(testStore.getZonesCardCount("player_two").deck).toBe(2);
//
//       expect(testStore.getZonesCardCount("player_one").deck).toBe(4);
//       expect(testStore.getZonesCardCount("player_one").hand).toBe(0);
//     });
//   });
// });
//
// describe("Regression", () => {
//   it("Shuffles before drawing", async () => {
//     const testStore = new TestEngine(
//       {
//         inkwell: youreWelcome.cost,
//         hand: [youreWelcome],
//         play: [forbiddenMountainMaleficentsCastle],
//         deck: 4,
//       },
//       {
//         deck: 3,
//       },
//     );
//
//     const cardUnderTest = testStore.getCardModel(youreWelcome);
//     const target = testStore.getCardModel(forbiddenMountainMaleficentsCastle);
//
//     await testStore.playCard(cardUnderTest);
//     await testStore.resolveTopOfStack({ targets: [target] });
//   });
// });
//
