// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseWaywardSorcerer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   ingeniousDevice,
//   theHornedKingTriumphantGhoul,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Horned King - Triumphant Ghoul", () => {
//   describe("GRAND MACHINATIONS - During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}", () => {
//     it("should have base lore value when no cards have left any discard pile", () => {
//       const testEngine = new TestEngine({
//         play: [theHornedKingTriumphantGhoul],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHornedKingTriumphantGhoul,
//       );
//
//       expect(cardUnderTest.lore).toBe(theHornedKingTriumphantGhoul.lore);
//     });
//
//     it("should get +2 lore when a card leaves own discard pile this turn", () => {
//       const testEngine = new TestEngine({
//         play: [theHornedKingTriumphantGhoul],
//         discard: [mickeyMouseWaywardSorcerer],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHornedKingTriumphantGhoul,
//       );
//       const mickeyCard = testEngine.getCardModel(mickeyMouseWaywardSorcerer);
//
//       // Before any card leaves discard
//       expect(cardUnderTest.lore).toBe(theHornedKingTriumphantGhoul.lore);
//       expect(mickeyCard.zone).toBe("discard");
//
//       // Move Mickey from discard to hand (simulating a return effect)
//       testEngine.store.tableStore.moveCard(mickeyCard.instanceId, "hand", {
//         skipLog: false,
//       });
//
//       // Mickey should be in hand now
//       expect(mickeyCard.zone).toBe("hand");
//
//       // Horned King should now have +2 lore
//       expect(cardUnderTest.lore).toBe(theHornedKingTriumphantGhoul.lore + 2); // 1 + 2 bonus
//     });
//
//     it("should get +2 lore when a card leaves opponent's discard pile this turn", () => {
//       const testEngine = new TestEngine(
//         {
//           play: [theHornedKingTriumphantGhoul],
//         },
//         {
//           discard: [mickeyMouseWaywardSorcerer],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHornedKingTriumphantGhoul,
//       );
//       const opponentMickey = testEngine.getCardModel(
//         mickeyMouseWaywardSorcerer,
//       );
//
//       // Before any card leaves discard
//       expect(cardUnderTest.lore).toBe(1);
//       expect(opponentMickey.zone).toBe("discard");
//
//       // Move opponent's card from discard to hand manually (simulating an effect)
//       testEngine.store.tableStore.moveCard(opponentMickey.instanceId, "hand", {
//         skipLog: false,
//       });
//
//       // Card should be in opponent's hand now
//       expect(opponentMickey.zone).toBe("hand");
//
//       // Horned King should now have +2 lore since ANY player's discard was affected
//       expect(cardUnderTest.lore).toBe(3); // 1 + 2 bonus
//     });
//
//     it("should get +2 lore when multiple cards leave discard pile (not stacking)", () => {
//       const testEngine = new TestEngine({
//         play: [theHornedKingTriumphantGhoul],
//         discard: [mickeyMouseWaywardSorcerer, ingeniousDevice],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHornedKingTriumphantGhoul,
//       );
//       const mickeyCard = testEngine.getCardModel(mickeyMouseWaywardSorcerer);
//       const itemCard = testEngine.getCardModel(ingeniousDevice);
//
//       // Before any cards leave discard
//       expect(cardUnderTest.lore).toBe(1);
//
//       // Move multiple cards from discard to hand
//       testEngine.store.tableStore.moveCard(mickeyCard.instanceId, "hand", {
//         skipLog: false,
//       });
//       testEngine.store.tableStore.moveCard(itemCard.instanceId, "hand", {
//         skipLog: false,
//       });
//
//       // Both cards should be in hand now
//       expect(mickeyCard.zone).toBe("hand");
//       expect(itemCard.zone).toBe("hand");
//
//       // Bonus should still be just +2, not +4 (doesn't stack per card)
//       expect(cardUnderTest.lore).toBe(3); // 1 + 2 bonus (not 1 + 4)
//     });
//
//     it("should lose the +2 lore bonus when the turn ends", () => {
//       const testEngine = new TestEngine({
//         play: [theHornedKingTriumphantGhoul],
//         discard: [mickeyMouseWaywardSorcerer],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHornedKingTriumphantGhoul,
//       );
//       const mickeyCard = testEngine.getCardModel(mickeyMouseWaywardSorcerer);
//
//       // Move Mickey from discard to hand
//       testEngine.store.tableStore.moveCard(mickeyCard.instanceId, "hand", {
//         skipLog: false,
//       });
//
//       // Should have bonus during the turn
//       expect(cardUnderTest.lore).toBe(3); // 1 + 2 bonus
//       expect(mickeyCard.zone).toBe("hand");
//
//       // Pass turn
//       testEngine.passTurn();
//
//       // Bonus should be gone (turn.cardsMoved resets)
//       expect(cardUnderTest.lore).toBe(1); // Base lore without bonus
//     });
//
//     it("should not get bonus during opponent's turn", () => {
//       const testEngine = new TestEngine(
//         {
//           play: [theHornedKingTriumphantGhoul],
//         },
//         {
//           discard: [mickeyMouseWaywardSorcerer],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHornedKingTriumphantGhoul,
//       );
//       const opponentMickey = testEngine.getCardModel(
//         mickeyMouseWaywardSorcerer,
//       );
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // Opponent moves a card from their discard to hand
//       testEngine.store.tableStore.moveCard(opponentMickey.instanceId, "hand", {
//         skipLog: false,
//       });
//
//       expect(opponentMickey.zone).toBe("hand");
//
//       // No bonus during opponent's turn (condition requires "during your turn")
//       expect(cardUnderTest.lore).toBe(1); // No bonus during opponent's turn
//     });
//   });
// });
//
