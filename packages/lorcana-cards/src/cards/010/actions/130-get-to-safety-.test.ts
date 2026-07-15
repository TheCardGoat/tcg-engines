// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GetToSafety,
//   SleepyHollowTheBridge,
//   TheGreatIlluminaryAbandonedLaboratory,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Get to Safety!", () => {
//   It("plays a location with cost 3 or less from discard for free", async () => {
//     // Arrange: Set up game with action in hand and a location in discard
//     Const testEngine = new TestEngine({
//       Inkwell: getToSafety.cost,
//       Hand: [getToSafety],
//       Discard: [sleepyHollowTheBridge], // Cost 3 location
//       Deck: 5,
//     });
//
//     Const initialDiscardCount = testEngine.getZonesCardCount().discard;
//
//     // Act: Play the action and choose the location
//     Await testEngine.playCard(getToSafety, {
//       Targets: [sleepyHollowTheBridge],
//     });
//
//     // Assert: Location should be moved from discard to play, action goes to discard
//     Expect(testEngine.getZonesCardCount().discard).toBe(initialDiscardCount); // Location moved from discard, action moved to discard
//     Expect(testEngine.getZonesCardCount().play).toBe(1); // Location now in play
//   });
//
//   It("does not draw a card when no Sleepy Hollow is in play", async () => {
//     // Arrange: Set up game without Sleepy Hollow in play
//     Const testEngine = new TestEngine({
//       Inkwell: getToSafety.cost,
//       Hand: [getToSafety],
//       Discard: [theGreatIlluminaryAbandonedLaboratory], // Location in discard but not in play
//       Deck: 5,
//     });
//
//     Const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action
//     Await testEngine.playCard(getToSafety, {
//       Targets: [theGreatIlluminaryAbandonedLaboratory],
//     });
//
//     // Assert: Should not draw a card
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: initialDeckCount, // No card drawn
//         Hand: 0, // No card drawn, action was discarded
//         Discard: 1, // Action discarded
//       }),
//     );
//   });
// });
//
// Describe("Regression", () => {
//   It("Get to Safety! + Sleepy Hollow - The Bridge", async () => {
//     // Arrange: Set up game with action in hand and a location in discard
//     Const testEngine = new TestEngine({
//       Inkwell: getToSafety.cost,
//       Hand: [getToSafety],
//       Discard: [sleepyHollowTheBridge], // Cost 3 location
//       Deck: 5,
//     });
//
//     Const initialDiscardCount = testEngine.getZonesCardCount().discard;
//
//     // Act: Play the action and choose the location
//     Await testEngine.playCard(getToSafety, {
//       Targets: [sleepyHollowTheBridge],
//     });
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Discard: initialDiscardCount, // You played Get to Safety! but returned Sleepy Hollow, so net 0.
//         Play: 1, // Sleepy Hollow - The Bridge
//         Hand: 1, // Drawn a card
//         Deck: 4,
//       }),
//     );
//   });
// });
//
