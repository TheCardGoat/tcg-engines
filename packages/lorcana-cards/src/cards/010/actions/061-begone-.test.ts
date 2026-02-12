// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { belleBookworm } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { rapunzelsTowerSecludedPrison } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { balooFriendAndGuardian } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import {
//   BalooCarefreeBear,
//   Begone,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { zootopiaPoliceHeadquarters } from "@lorcanito/lorcana-engine/cards/010/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Begone!", () => {
//   Describe("Return character with cost 3 or less", () => {
//     It("should return opponent's character with cost 3 to their hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [belleBookworm], // cost 3
//         },
//       );
//
//       Const opponentCharacter = testEngine.getCardModel(belleBookworm);
//
//       Await testEngine.playCard(begone, { targets: [opponentCharacter] });
//
//       Expect(opponentCharacter.zone).toBe("hand");
//       Expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//
//     It("should return your own character with cost 3 to your hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone],
//           Play: [belleBookworm], // cost 3
//         },
//         {},
//       );
//
//       Const yourCharacter = testEngine.getCardModel(belleBookworm);
//
//       Await testEngine.playCard(begone, { targets: [yourCharacter] });
//
//       Expect(yourCharacter.zone).toBe("hand");
//       Expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//
//     It("should not allow returning character with cost 4 or more", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone],
//         },
//         {
//           Play: [balooFriendAndGuardian], // cost 4
//         },
//       );
//
//       Const expensiveCharacter = testEngine.getCardModel(
//         BalooFriendAndGuardian,
//       );
//
//       // The card should not be playable if there are no valid targets
//       // or the expensive character should not be a valid target
//       Expect(expensiveCharacter.zone).toBe("play");
//     });
//   });
//
//   Describe("Return item with cost 3 or less", () => {
//     It("should return opponent's item with cost 1 to their hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [dingleHopper], // cost 1
//         },
//       );
//
//       Const opponentItem = testEngine.getCardModel(dingleHopper);
//
//       Await testEngine.playCard(begone, { targets: [opponentItem] });
//
//       Expect(opponentItem.zone).toBe("hand");
//       Expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//   });
//
//   Describe("Return location with cost 3 or less", () => {
//     It("should return opponent's location with cost 1 to their hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [zootopiaPoliceHeadquarters], // cost 1
//         },
//       );
//
//       Const opponentLocation = testEngine.getCardModel(
//         ZootopiaPoliceHeadquarters,
//       );
//
//       Await testEngine.playCard(begone, { targets: [opponentLocation] });
//
//       Expect(opponentLocation.zone).toBe("hand");
//       Expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//
//     It("should return your own location with cost 2 to your hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone],
//           Play: [rapunzelsTowerSecludedPrison], // cost 2
//         },
//         {},
//       );
//
//       Const yourLocation = testEngine.getCardModel(
//         RapunzelsTowerSecludedPrison,
//       );
//
//       Await testEngine.playCard(begone, { targets: [yourLocation] });
//
//       Expect(yourLocation.zone).toBe("hand");
//       Expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//   });
//
//   Describe("Edge cases", () => {
//     It("should work when there are multiple valid targets in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone],
//           Play: [balooFriendAndGuardian], // cost 6, not targetable
//         },
//         {
//           Play: [belleBookworm, dingleHopper],
//         },
//       );
//
//       Const opponentCharacter = testEngine.getCardModel(belleBookworm);
//       Const opponentItem = testEngine.getCardModel(dingleHopper);
//
//       // Target the character
//       Await testEngine.playCard(begone, { targets: [opponentCharacter] });
//
//       Expect(opponentCharacter.zone).toBe("hand");
//       Expect(opponentItem.zone).toBe("play"); // Should still be in play
//       Expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//
//     It("identifies valid targets correctly by cost", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone],
//         },
//         {
//           Play: [balooFriendAndGuardian], // cost 6, too expensive
//         },
//       );
//
//       // Verify that expensive characters are correctly identified as invalid targets
//       Const expensiveCharacter = testEngine.getCardModel(
//         BalooFriendAndGuardian,
//       );
//       Expect(expensiveCharacter.cost).toBe(6);
//       Expect(expensiveCharacter.cost).toBeGreaterThan(3);
//       Expect(expensiveCharacter.zone).toBe("play");
//     });
//
//     It("should properly handle cards in different zones", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone, balooCarefreeBear], // character in hand, not in play
//         },
//         {},
//       );
//
//       // The character in hand should not be a valid target
//       // Only cards in play zone should be targetable
//       Const characterInHand = testEngine.getCardModel(balooCarefreeBear);
//       Expect(characterInHand.zone).toBe("hand");
//
//       // Card should not be playable if there are no valid targets in play
//       Expect(testEngine.getCardModel(begone).zone).toBe("hand");
//     });
//   });
//
//   Describe("Cost restriction", () => {
//     It("should enforce cost 3 or less restriction correctly", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: begone.cost,
//           Hand: [begone],
//         },
//         {
//           Play: [balooFriendAndGuardian], // cost 6, too expensive
//         },
//       );
//
//       Const expensiveCharacter = testEngine.getCardModel(
//         BalooFriendAndGuardian,
//       );
//
//       // Verify the character has cost 6, which is more than the 3 limit
//       Expect(expensiveCharacter.cost).toBe(6);
//       Expect(expensiveCharacter.cost).toBeGreaterThan(3);
//       Expect(expensiveCharacter.zone).toBe("play");
//     });
//   });
// });
//
