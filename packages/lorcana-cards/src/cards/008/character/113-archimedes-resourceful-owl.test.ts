// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { gumboPot } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { belleApprenticeInventor } from "@lorcanito/lorcana-engine/cards/007/characters/characters";
// import { spaghettiDinner } from "@lorcanito/lorcana-engine/cards/007/items/items";
// import { archimedesResourcefulOwl } from "@lorcanito/lorcana-engine/cards/008/character/113-archimedes-resourceful-owl";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Archimedes - Resourceful Owl", () => {
//   describe("NOW, THAT'S NOT BAD - During your turn, whenever an item is banished, you may draw a card, then choose and discard a card", () => {
//     it("should trigger during your turn when you banish an item", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [archimedesResourcefulOwl, gumboPot],
//           deck: 5,
//           hand: 3,
//         },
//         {},
//       );
//
//       const archimedes = testEngine.getCardModel(archimedesResourcefulOwl);
//       const item = testEngine.getCardModel(gumboPot);
//       const initialHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//
//       // Banish the item during your turn
//       item.banish();
//
//       // Should trigger Archimedes' ability
//       expect(testEngine.stackLayers.length).toBeGreaterThan(0);
//
//       // Resolve the ability (draw and discard)
//       const handCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       const cardToDiscard = handCards[handCards.length - 1];
//       if (!cardToDiscard) throw new Error("No card in hand");
//
//       await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // Hand size should increase by 1 (drew 1, discarded 1)
//       const finalHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//       expect(finalHandSize).toBe(initialHandSize + 1);
//     });
//
//     it("should NOT trigger during opponent's turn when opponent banishes an item", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [archimedesResourcefulOwl],
//         },
//         {
//           play: [gumboPot],
//         },
//       );
//
//       const archimedes = testEngine.getCardModel(archimedesResourcefulOwl);
//       const opponentItem = testEngine.getCardModel(gumboPot, 1);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // Opponent banishes their item directly
//       opponentItem.banish();
//
//       // Archimedes' ability should NOT trigger - stack should be empty
//       // The log will show "Found 1 triggers, Filtered to 0 triggers" confirming
//       // the duringYourTurn condition is working
//       expect(testEngine.stackLayers.length).toBe(0);
//     });
//
//     it("should NOT trigger during opponent's turn when opponent uses Belle's alternate cost to banish an item", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [archimedesResourcefulOwl],
//         },
//         {
//           play: [spaghettiDinner],
//           hand: [belleApprenticeInventor],
//         },
//       );
//
//       const archimedes = testEngine.getCardModel(archimedesResourcefulOwl);
//       const opponentItem = testEngine.getCardModel(spaghettiDinner, 1);
//       const opponentBelle = testEngine.getCardModel(belleApprenticeInventor, 1);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // Opponent plays Belle using alternate cost (banish item)
//       // The item is banished as part of the alternate cost payment before Belle enters play
//       // Note: playCard may not create a stack layer when using alternate costs,
//       // so we check the stack before and after to ensure Archimedes doesn't trigger
//       const stackBefore = testEngine.stackLayers.length;
//
//       try {
//         await testEngine.playCard(opponentBelle, {
//           alternativeCosts: [opponentItem],
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
//       expect(opponentItem.zone).toBe("discard");
//       expect(testEngine.stackLayers.length).toBe(stackBefore);
//     });
//   });
// });
//
