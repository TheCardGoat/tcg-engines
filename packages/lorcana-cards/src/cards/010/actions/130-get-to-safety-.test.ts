// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   getToSafety,
//   sleepyHollowTheBridge,
//   theGreatIlluminaryAbandonedLaboratory,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Get to Safety!", () => {
//   it("plays a location with cost 3 or less from discard for free", async () => {
//     // Arrange: Set up game with action in hand and a location in discard
//     const testEngine = new TestEngine({
//       inkwell: getToSafety.cost,
//       hand: [getToSafety],
//       discard: [sleepyHollowTheBridge], // Cost 3 location
//       deck: 5,
//     });
//
//     const initialDiscardCount = testEngine.getZonesCardCount().discard;
//
//     // Act: Play the action and choose the location
//     await testEngine.playCard(getToSafety, {
//       targets: [sleepyHollowTheBridge],
//     });
//
//     // Assert: Location should be moved from discard to play, action goes to discard
//     expect(testEngine.getZonesCardCount().discard).toBe(initialDiscardCount); // Location moved from discard, action moved to discard
//     expect(testEngine.getZonesCardCount().play).toBe(1); // Location now in play
//   });
//
//   it("does not draw a card when no Sleepy Hollow is in play", async () => {
//     // Arrange: Set up game without Sleepy Hollow in play
//     const testEngine = new TestEngine({
//       inkwell: getToSafety.cost,
//       hand: [getToSafety],
//       discard: [theGreatIlluminaryAbandonedLaboratory], // Location in discard but not in play
//       deck: 5,
//     });
//
//     const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action
//     await testEngine.playCard(getToSafety, {
//       targets: [theGreatIlluminaryAbandonedLaboratory],
//     });
//
//     // Assert: Should not draw a card
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         deck: initialDeckCount, // No card drawn
//         hand: 0, // No card drawn, action was discarded
//         discard: 1, // Action discarded
//       }),
//     );
//   });
// });
//
// describe("Regression", () => {
//   it("Get to Safety! + Sleepy Hollow - The Bridge", async () => {
//     // Arrange: Set up game with action in hand and a location in discard
//     const testEngine = new TestEngine({
//       inkwell: getToSafety.cost,
//       hand: [getToSafety],
//       discard: [sleepyHollowTheBridge], // Cost 3 location
//       deck: 5,
//     });
//
//     const initialDiscardCount = testEngine.getZonesCardCount().discard;
//
//     // Act: Play the action and choose the location
//     await testEngine.playCard(getToSafety, {
//       targets: [sleepyHollowTheBridge],
//     });
//
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         discard: initialDiscardCount, // You played Get to Safety! but returned Sleepy Hollow, so net 0.
//         play: 1, // Sleepy Hollow - The Bridge
//         hand: 1, // Drawn a card
//         deck: 4,
//       }),
//     );
//   });
// });
//
