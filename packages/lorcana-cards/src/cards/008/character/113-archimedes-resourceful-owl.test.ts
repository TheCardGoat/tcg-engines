// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { gumboPot } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { belleApprenticeInventor } from "@lorcanito/lorcana-engine/cards/007/characters/characters";
// Import { spaghettiDinner } from "@lorcanito/lorcana-engine/cards/007/items/items";
// Import { archimedesResourcefulOwl } from "@lorcanito/lorcana-engine/cards/008/character/113-archimedes-resourceful-owl";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Archimedes - Resourceful Owl", () => {
//   Describe("NOW, THAT'S NOT BAD - During your turn, whenever an item is banished, you may draw a card, then choose and discard a card", () => {
//     It("should trigger during your turn when you banish an item", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [archimedesResourcefulOwl, gumboPot],
//           Deck: 5,
//           Hand: 3,
//         },
//         {},
//       );
//
//       Const archimedes = testEngine.getCardModel(archimedesResourcefulOwl);
//       Const item = testEngine.getCardModel(gumboPot);
//       Const initialHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//
//       // Banish the item during your turn
//       Item.banish();
//
//       // Should trigger Archimedes' ability
//       Expect(testEngine.stackLayers.length).toBeGreaterThan(0);
//
//       // Resolve the ability (draw and discard)
//       Const handCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       Const cardToDiscard = handCards[handCards.length - 1];
//       If (!cardToDiscard) throw new Error("No card in hand");
//
//       Await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // Hand size should increase by 1 (drew 1, discarded 1)
//       Const finalHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//       Expect(finalHandSize).toBe(initialHandSize + 1);
//     });
//
//     It("should NOT trigger during opponent's turn when opponent banishes an item", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [archimedesResourcefulOwl],
//         },
//         {
//           Play: [gumboPot],
//         },
//       );
//
//       Const archimedes = testEngine.getCardModel(archimedesResourcefulOwl);
//       Const opponentItem = testEngine.getCardModel(gumboPot, 1);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // Opponent banishes their item directly
//       OpponentItem.banish();
//
//       // Archimedes' ability should NOT trigger - stack should be empty
//       // The log will show "Found 1 triggers, Filtered to 0 triggers" confirming
//       // the duringYourTurn condition is working
//       Expect(testEngine.stackLayers.length).toBe(0);
//     });
//
//     It("should NOT trigger during opponent's turn when opponent uses Belle's alternate cost to banish an item", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [archimedesResourcefulOwl],
//         },
//         {
//           Play: [spaghettiDinner],
//           Hand: [belleApprenticeInventor],
//         },
//       );
//
//       Const archimedes = testEngine.getCardModel(archimedesResourcefulOwl);
//       Const opponentItem = testEngine.getCardModel(spaghettiDinner, 1);
//       Const opponentBelle = testEngine.getCardModel(belleApprenticeInventor, 1);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // Opponent plays Belle using alternate cost (banish item)
//       // The item is banished as part of the alternate cost payment before Belle enters play
//       // Note: playCard may not create a stack layer when using alternate costs,
//       // so we check the stack before and after to ensure Archimedes doesn't trigger
//       Const stackBefore = testEngine.stackLayers.length;
//
//       Try {
//         Await testEngine.playCard(opponentBelle, {
//           AlternativeCosts: [opponentItem],
//         });
//       } catch (error) {
//         // playCard may fail if there's nothing on stack, which is fine
//         // The important thing is that Archimedes didn't trigger
//       }
//
//       // Archimedes' ability should NOT trigger
//       // The log will show "Found 1 triggers, Filtered to 0 triggers" which confirms
//       // the duringYourTurn condition is working correctly
//       // The item was banished (check zone) but Archimedes didn't trigger (stack unchanged)
//       Expect(opponentItem.zone).toBe("discard");
//       Expect(testEngine.stackLayers.length).toBe(stackBefore);
//     });
//   });
// });
//
