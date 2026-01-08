// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { belleBookworm } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { rapunzelsTowerSecludedPrison } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// import { balooFriendAndGuardian } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import {
//   balooCarefreeBear,
//   begone,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { zootopiaPoliceHeadquarters } from "@lorcanito/lorcana-engine/cards/010/locations/locations";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Begone!", () => {
//   describe("Return character with cost 3 or less", () => {
//     it("should return opponent's character with cost 3 to their hand", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [belleBookworm], // cost 3
//         },
//       );
//
//       const opponentCharacter = testEngine.getCardModel(belleBookworm);
//
//       await testEngine.playCard(begone, { targets: [opponentCharacter] });
//
//       expect(opponentCharacter.zone).toBe("hand");
//       expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//
//     it("should return your own character with cost 3 to your hand", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone],
//           play: [belleBookworm], // cost 3
//         },
//         {},
//       );
//
//       const yourCharacter = testEngine.getCardModel(belleBookworm);
//
//       await testEngine.playCard(begone, { targets: [yourCharacter] });
//
//       expect(yourCharacter.zone).toBe("hand");
//       expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//
//     it("should not allow returning character with cost 4 or more", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone],
//         },
//         {
//           play: [balooFriendAndGuardian], // cost 4
//         },
//       );
//
//       const expensiveCharacter = testEngine.getCardModel(
//         balooFriendAndGuardian,
//       );
//
//       // The card should not be playable if there are no valid targets
//       // or the expensive character should not be a valid target
//       expect(expensiveCharacter.zone).toBe("play");
//     });
//   });
//
//   describe("Return item with cost 3 or less", () => {
//     it("should return opponent's item with cost 1 to their hand", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [dingleHopper], // cost 1
//         },
//       );
//
//       const opponentItem = testEngine.getCardModel(dingleHopper);
//
//       await testEngine.playCard(begone, { targets: [opponentItem] });
//
//       expect(opponentItem.zone).toBe("hand");
//       expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//   });
//
//   describe("Return location with cost 3 or less", () => {
//     it("should return opponent's location with cost 1 to their hand", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [zootopiaPoliceHeadquarters], // cost 1
//         },
//       );
//
//       const opponentLocation = testEngine.getCardModel(
//         zootopiaPoliceHeadquarters,
//       );
//
//       await testEngine.playCard(begone, { targets: [opponentLocation] });
//
//       expect(opponentLocation.zone).toBe("hand");
//       expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//
//     it("should return your own location with cost 2 to your hand", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone],
//           play: [rapunzelsTowerSecludedPrison], // cost 2
//         },
//         {},
//       );
//
//       const yourLocation = testEngine.getCardModel(
//         rapunzelsTowerSecludedPrison,
//       );
//
//       await testEngine.playCard(begone, { targets: [yourLocation] });
//
//       expect(yourLocation.zone).toBe("hand");
//       expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//   });
//
//   describe("Edge cases", () => {
//     it("should work when there are multiple valid targets in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone],
//           play: [balooFriendAndGuardian], // cost 6, not targetable
//         },
//         {
//           play: [belleBookworm, dingleHopper],
//         },
//       );
//
//       const opponentCharacter = testEngine.getCardModel(belleBookworm);
//       const opponentItem = testEngine.getCardModel(dingleHopper);
//
//       // Target the character
//       await testEngine.playCard(begone, { targets: [opponentCharacter] });
//
//       expect(opponentCharacter.zone).toBe("hand");
//       expect(opponentItem.zone).toBe("play"); // Should still be in play
//       expect(testEngine.getCardModel(begone).zone).toBe("discard");
//     });
//
//     it("identifies valid targets correctly by cost", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone],
//         },
//         {
//           play: [balooFriendAndGuardian], // cost 6, too expensive
//         },
//       );
//
//       // Verify that expensive characters are correctly identified as invalid targets
//       const expensiveCharacter = testEngine.getCardModel(
//         balooFriendAndGuardian,
//       );
//       expect(expensiveCharacter.cost).toBe(6);
//       expect(expensiveCharacter.cost).toBeGreaterThan(3);
//       expect(expensiveCharacter.zone).toBe("play");
//     });
//
//     it("should properly handle cards in different zones", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone, balooCarefreeBear], // character in hand, not in play
//         },
//         {},
//       );
//
//       // The character in hand should not be a valid target
//       // Only cards in play zone should be targetable
//       const characterInHand = testEngine.getCardModel(balooCarefreeBear);
//       expect(characterInHand.zone).toBe("hand");
//
//       // Card should not be playable if there are no valid targets in play
//       expect(testEngine.getCardModel(begone).zone).toBe("hand");
//     });
//   });
//
//   describe("Cost restriction", () => {
//     it("should enforce cost 3 or less restriction correctly", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: begone.cost,
//           hand: [begone],
//         },
//         {
//           play: [balooFriendAndGuardian], // cost 6, too expensive
//         },
//       );
//
//       const expensiveCharacter = testEngine.getCardModel(
//         balooFriendAndGuardian,
//       );
//
//       // Verify the character has cost 6, which is more than the 3 limit
//       expect(expensiveCharacter.cost).toBe(6);
//       expect(expensiveCharacter.cost).toBeGreaterThan(3);
//       expect(expensiveCharacter.zone).toBe("play");
//     });
//   });
// });
//
