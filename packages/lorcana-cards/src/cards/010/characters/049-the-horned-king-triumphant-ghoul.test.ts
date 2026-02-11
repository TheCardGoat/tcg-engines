// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseWaywardSorcerer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   IngeniousDevice,
//   TheHornedKingTriumphantGhoul,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Horned King - Triumphant Ghoul", () => {
//   Describe("GRAND MACHINATIONS - During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}", () => {
//     It("should have base lore value when no cards have left any discard pile", () => {
//       Const testEngine = new TestEngine({
//         Play: [theHornedKingTriumphantGhoul],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHornedKingTriumphantGhoul,
//       );
//
//       Expect(cardUnderTest.lore).toBe(theHornedKingTriumphantGhoul.lore);
//     });
//
//     It("should get +2 lore when a card leaves own discard pile this turn", () => {
//       Const testEngine = new TestEngine({
//         Play: [theHornedKingTriumphantGhoul],
//         Discard: [mickeyMouseWaywardSorcerer],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHornedKingTriumphantGhoul,
//       );
//       Const mickeyCard = testEngine.getCardModel(mickeyMouseWaywardSorcerer);
//
//       // Before any card leaves discard
//       Expect(cardUnderTest.lore).toBe(theHornedKingTriumphantGhoul.lore);
//       Expect(mickeyCard.zone).toBe("discard");
//
//       // Move Mickey from discard to hand (simulating a return effect)
//       TestEngine.store.tableStore.moveCard(mickeyCard.instanceId, "hand", {
//         SkipLog: false,
//       });
//
//       // Mickey should be in hand now
//       Expect(mickeyCard.zone).toBe("hand");
//
//       // Horned King should now have +2 lore
//       Expect(cardUnderTest.lore).toBe(theHornedKingTriumphantGhoul.lore + 2); // 1 + 2 bonus
//     });
//
//     It("should get +2 lore when a card leaves opponent's discard pile this turn", () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [theHornedKingTriumphantGhoul],
//         },
//         {
//           Discard: [mickeyMouseWaywardSorcerer],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHornedKingTriumphantGhoul,
//       );
//       Const opponentMickey = testEngine.getCardModel(
//         MickeyMouseWaywardSorcerer,
//       );
//
//       // Before any card leaves discard
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(opponentMickey.zone).toBe("discard");
//
//       // Move opponent's card from discard to hand manually (simulating an effect)
//       TestEngine.store.tableStore.moveCard(opponentMickey.instanceId, "hand", {
//         SkipLog: false,
//       });
//
//       // Card should be in opponent's hand now
//       Expect(opponentMickey.zone).toBe("hand");
//
//       // Horned King should now have +2 lore since ANY player's discard was affected
//       Expect(cardUnderTest.lore).toBe(3); // 1 + 2 bonus
//     });
//
//     It("should get +2 lore when multiple cards leave discard pile (not stacking)", () => {
//       Const testEngine = new TestEngine({
//         Play: [theHornedKingTriumphantGhoul],
//         Discard: [mickeyMouseWaywardSorcerer, ingeniousDevice],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHornedKingTriumphantGhoul,
//       );
//       Const mickeyCard = testEngine.getCardModel(mickeyMouseWaywardSorcerer);
//       Const itemCard = testEngine.getCardModel(ingeniousDevice);
//
//       // Before any cards leave discard
//       Expect(cardUnderTest.lore).toBe(1);
//
//       // Move multiple cards from discard to hand
//       TestEngine.store.tableStore.moveCard(mickeyCard.instanceId, "hand", {
//         SkipLog: false,
//       });
//       TestEngine.store.tableStore.moveCard(itemCard.instanceId, "hand", {
//         SkipLog: false,
//       });
//
//       // Both cards should be in hand now
//       Expect(mickeyCard.zone).toBe("hand");
//       Expect(itemCard.zone).toBe("hand");
//
//       // Bonus should still be just +2, not +4 (doesn't stack per card)
//       Expect(cardUnderTest.lore).toBe(3); // 1 + 2 bonus (not 1 + 4)
//     });
//
//     It("should lose the +2 lore bonus when the turn ends", () => {
//       Const testEngine = new TestEngine({
//         Play: [theHornedKingTriumphantGhoul],
//         Discard: [mickeyMouseWaywardSorcerer],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHornedKingTriumphantGhoul,
//       );
//       Const mickeyCard = testEngine.getCardModel(mickeyMouseWaywardSorcerer);
//
//       // Move Mickey from discard to hand
//       TestEngine.store.tableStore.moveCard(mickeyCard.instanceId, "hand", {
//         SkipLog: false,
//       });
//
//       // Should have bonus during the turn
//       Expect(cardUnderTest.lore).toBe(3); // 1 + 2 bonus
//       Expect(mickeyCard.zone).toBe("hand");
//
//       // Pass turn
//       TestEngine.passTurn();
//
//       // Bonus should be gone (turn.cardsMoved resets)
//       Expect(cardUnderTest.lore).toBe(1); // Base lore without bonus
//     });
//
//     It("should not get bonus during opponent's turn", () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [theHornedKingTriumphantGhoul],
//         },
//         {
//           Discard: [mickeyMouseWaywardSorcerer],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHornedKingTriumphantGhoul,
//       );
//       Const opponentMickey = testEngine.getCardModel(
//         MickeyMouseWaywardSorcerer,
//       );
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // Opponent moves a card from their discard to hand
//       TestEngine.store.tableStore.moveCard(opponentMickey.instanceId, "hand", {
//         SkipLog: false,
//       });
//
//       Expect(opponentMickey.zone).toBe("hand");
//
//       // No bonus during opponent's turn (condition requires "during your turn")
//       Expect(cardUnderTest.lore).toBe(1); // No bonus during opponent's turn
//     });
//   });
// });
//
